import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { getRequestListener } from "@hono/node-server";
import { generateImage, generateText } from "ai";
import { Hono } from "hono";

export const config = {
  api: {
    bodyParser: false,
  },
};

const TEXT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
const IMAGE_MODELS = ["gemini-2.5-flash-image", "gemini-3.1-flash-image-preview", "gemini-3-pro-image-preview"];

const PROJECTCHAT_AI_INSTRUCTIONS = `You are ProjectChat AI, a friendly person-like assistant inside a realtime chat app.
Answer naturally, concisely, and in the user's language. Do not mention internal systems, API keys, model routing, providers, Supabase, Vercel, Hono, Mastra, or implementation details unless the user explicitly asks technical questions.
If the user asks for an image, generate the image instead of describing that you cannot.`;

export const projectChatAiAgent = new Agent({
  id: "projectchat-ai",
  name: "ProjectChat AI",
  instructions: PROJECTCHAT_AI_INSTRUCTIONS,
  model: "google/gemini-2.5-flash",
});

const app = new Hono().basePath("/api");

const getGoogleProvider = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;
  return createGoogleGenerativeAI({ apiKey });
};

const sanitizeText = (value) => String(value || "").replace(/\s+/g, " ").trim().slice(0, 4000);

const toConversationPrompt = (messages, fallbackPrompt, language) => {
  const recentMessages = Array.isArray(messages) ? messages.slice(-14) : [];
  const transcript = recentMessages
    .map((message) => {
      const role = message.role === "assistant" ? "ProjectChat AI" : "User";
      const content = sanitizeText(message.content || message.message);
      return content ? `${role}: ${content}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const prompt = transcript || `User: ${sanitizeText(fallbackPrompt)}`;
  return `Preferred language: ${language === "en" ? "English" : "Portuguese (Brazil)"}\n\n${prompt}\n\nProjectChat AI:`;
};

const lastUserPrompt = (messages, prompt) => {
  const recentMessages = Array.isArray(messages) ? [...messages].reverse() : [];
  const lastUserMessage = recentMessages.find((message) => message.role !== "assistant");
  return sanitizeText(lastUserMessage?.content || lastUserMessage?.message || prompt);
};

const wantsImage = (prompt, mode) => {
  if (mode === "image") return true;
  return /(^|\s)(\/imagem|\/image|gere uma imagem|crie uma imagem|criar uma imagem|desenhe|imagem de|generate an image|create an image|draw|image of)(\s|$)/i.test(prompt);
};

const runTextCascade = async ({ google, messages, prompt, language }) => {
  const conversationPrompt = toConversationPrompt(messages, prompt, language);
  const failures = [];

  for (const modelId of TEXT_MODELS) {
    try {
      const agent = new Agent({
        id: `projectchat-ai-${modelId}`,
        name: "ProjectChat AI",
        instructions: PROJECTCHAT_AI_INSTRUCTIONS,
        model: google(modelId),
      });
      const result = await agent.generate(conversationPrompt);
      if (result?.text) return { text: result.text.trim(), model: modelId, framework: "mastra" };
    } catch (error) {
      failures.push(error);
    }

    try {
      const result = await generateText({
        model: google(modelId),
        system: PROJECTCHAT_AI_INSTRUCTIONS,
        prompt: conversationPrompt,
        maxRetries: 0,
      });
      if (result.text) return { text: result.text.trim(), model: modelId, framework: "ai-sdk" };
    } catch (error) {
      failures.push(error);
    }
  }

  throw new Error(`All text models failed: ${failures.length}`);
};

const runImageCascade = async ({ google, prompt }) => {
  const cleanPrompt = sanitizeText(prompt).replace(/^\/(imagem|image)\s*/i, "");
  const failures = [];

  for (const modelId of IMAGE_MODELS) {
    try {
      const { image } = await generateImage({
        model: google.image(modelId),
        prompt: cleanPrompt,
        aspectRatio: "1:1",
        maxRetries: 0,
      });
      if (image?.base64) {
        return {
          image: `data:${image.mediaType || "image/png"};base64,${image.base64}`,
          model: modelId,
        };
      }
    } catch (error) {
      failures.push(error);
    }
  }

  throw new Error(`All image models failed: ${failures.length}`);
};

app.post("/ai/chat", async (c) => {
  const google = getGoogleProvider();
  if (!google) {
    return c.json({ error: "AI_NOT_CONFIGURED" }, 503);
  }

  try {
    const body = await c.req.json();
    const prompt = lastUserPrompt(body.messages, body.prompt);
    const language = body.language === "en" ? "en" : "pt-BR";

    if (!prompt) {
      return c.json({ error: "EMPTY_PROMPT" }, 400);
    }

    if (wantsImage(prompt, body.mode)) {
      const result = await runImageCascade({ google, prompt });
      return c.json({
        type: "image",
        image: result.image,
        text: language === "en" ? "I created this image for you." : "Criei esta imagem para voce.",
        model: result.model,
      });
    }

    const result = await runTextCascade({ google, messages: body.messages, prompt, language });
    return c.json({ type: "text", text: result.text, model: result.model, framework: result.framework });
  } catch {
    return c.json({ error: "AI_REQUEST_FAILED" }, 502);
  }
});

export default getRequestListener(app.fetch);

import { AssistantChatTransport } from "@assistant-ui/react-ai-sdk";

export const ASSISTANT_UI_API = "/api/ai/chat";

export const createAssistantUiTransport = () => new AssistantChatTransport({ api: ASSISTANT_UI_API });

export const getAssistantUiRequestMetadata = () => ({
  endpoint: ASSISTANT_UI_API,
  transport: "AssistantChatTransport",
});

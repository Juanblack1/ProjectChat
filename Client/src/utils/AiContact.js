export const AI_CONTACT_ID = "projectchat-ai";

const AI_MESSAGES_STORAGE_PREFIX = "projectchat:ai-messages";

const storageKeyForUser = (userId) => `${AI_MESSAGES_STORAGE_PREFIX}:${userId || "guest"}`;

export const isAiContact = (contact) => contact?.id === AI_CONTACT_ID || contact?.isAi === true;

export const getAiContact = (labels = {}) => ({
  id: AI_CONTACT_ID,
  email: "ai@projectchat.local",
  name: "ProjectChat AI",
  profileImage: "/favicon.png",
  profilePicture: "/favicon.png",
  status: labels.status || "AI assistant",
  about: labels.status || "AI assistant",
  lastSeen: labels.online || "online",
  isOnline: true,
  isAi: true,
  pinned: true,
  muted: false,
  label: "AI",
});

const fallbackMessages = (userId, labels = {}) => ([
  {
    id: `${AI_CONTACT_ID}-welcome`,
    senderId: AI_CONTACT_ID,
    recieverId: userId,
    type: "text",
    message: labels.welcome || "Oi, sou o ProjectChat AI. Como posso ajudar?",
    messageStatus: "read",
    createdAt: new Date().toISOString(),
  },
]);

export const getAiMessages = (userId, labels = {}) => {
  if (typeof window === "undefined") return fallbackMessages(userId, labels);

  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKeyForUser(userId)) || "[]");
    return Array.isArray(stored) && stored.length ? stored : fallbackMessages(userId, labels);
  } catch {
    window.localStorage.removeItem(storageKeyForUser(userId));
    return fallbackMessages(userId, labels);
  }
};

export const saveAiMessages = (userId, messages) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeyForUser(userId), JSON.stringify(messages.slice(-60)));
};

export const addAiMessages = (userId, newMessages, labels = {}) => {
  const messages = [...getAiMessages(userId, labels), ...newMessages];
  saveAiMessages(userId, messages);
  return messages;
};

export const createAiUserMessage = ({ userId, message }) => ({
  id: `${userId || "user"}-${Date.now()}`,
  senderId: userId,
  recieverId: AI_CONTACT_ID,
  type: "text",
  message,
  messageStatus: "read",
  createdAt: new Date().toISOString(),
});

export const createAiAssistantMessage = ({ userId, message, type = "text" }) => ({
  id: `${AI_CONTACT_ID}-${Date.now()}`,
  senderId: AI_CONTACT_ID,
  recieverId: userId,
  type,
  message,
  messageStatus: "read",
  createdAt: new Date().toISOString(),
});

export const getAiConversationPreview = (userId, labels = {}) => {
  const messages = getAiMessages(userId, labels);
  const lastMessage = messages[messages.length - 1];

  return {
    text: lastMessage?.type === "image"
      ? labels.photo || "Image"
      : lastMessage?.message || labels.welcome || "ProjectChat AI",
    createdAt: lastMessage?.createdAt,
    messageStatus: lastMessage?.messageStatus || "read",
    senderId: lastMessage?.senderId,
    recieverId: lastMessage?.recieverId,
    type: lastMessage?.type || "text",
    unreadCount: 0,
    totalUnreadMessages: 0,
  };
};

export const toAiApiMessages = (messages, userId) => messages
  .filter((message) => message.type === "text" && message.message)
  .slice(-14)
  .map((message) => ({
    role: message.senderId === AI_CONTACT_ID ? "assistant" : "user",
    content: message.message,
    id: message.id,
    userId,
  }));

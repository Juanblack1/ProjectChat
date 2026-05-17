export const DEMO_USER = {
  id: 1,
  name: "Visitante Demo",
  email: "demo@projectchat.local",
  profileImage: "/default_avatar.png",
  status: "Explorando o ProjectChat em modo seguro",
};

export const DEMO_CONTACTS = [
  {
    id: 2,
    name: "Ana Produto",
    email: "ana@projectchat.local",
    profilePicture: "/avatars/2.png",
    about: "Validando o fluxo de conversa",
  },
  {
    id: 3,
    name: "Bruno Suporte",
    email: "bruno@projectchat.local",
    profilePicture: "/avatars/3.png",
    about: "Online para testes de UI",
  },
  {
    id: 4,
    name: "Carla Design",
    email: "carla@projectchat.local",
    profilePicture: "/avatars/4.png",
    about: "Ajustando experiencia visual",
  },
];

const DEMO_MESSAGES_STORAGE_KEY = "projectchat.demo.messages";
const DEMO_PROFILE_STORAGE_KEY = "projectchat.demo.profile";
const DEMO_SESSION_STORAGE_KEY = "projectchat.demo.session";

export const hasDemoSession = () => (
  typeof window !== "undefined" && localStorage.getItem(DEMO_SESSION_STORAGE_KEY) === "active"
);

export const getDemoProfile = () => {
  if (typeof window === "undefined") return DEMO_USER;

  try {
    const profile = JSON.parse(localStorage.getItem(DEMO_PROFILE_STORAGE_KEY));
    return profile ? {...DEMO_USER, ...profile, id: DEMO_USER.id} : DEMO_USER;
  } catch {
    localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
    return DEMO_USER;
  }
};

export const saveDemoProfile = (profile) => {
  if (typeof window === "undefined") return DEMO_USER;

  const nextProfile = {...DEMO_USER, ...profile, id: DEMO_USER.id};
  localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
};

export const startDemoSession = () => {
  if (typeof window === "undefined") return DEMO_USER;
  localStorage.setItem(DEMO_SESSION_STORAGE_KEY, "active");
  return getDemoProfile();
};

export const endDemoSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
};

export const groupContacts = (contacts) => contacts.reduce((groups, contact) => {
  const initial = contact.name.charAt(0).toUpperCase();
  groups[initial] = [...(groups[initial] || []), contact];
  return groups;
}, {});

export const DEMO_CONTACT_GROUPS = groupContacts(DEMO_CONTACTS);

export const getDemoMessages = (contactId) => [
  {
    id: Number(`${contactId}01`),
    senderId: contactId,
    recieverId: DEMO_USER.id,
    type: "text",
    message: "Oi! Este e um ambiente demo sem persistencia real.",
    messageStatus: "read",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: Number(`${contactId}02`),
    senderId: DEMO_USER.id,
    recieverId: contactId,
    type: "text",
    message: "Perfeito. Assim qualquer pessoa pode testar sem expor dados privados.",
    messageStatus: "read",
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
];

const readDemoMessageStore = () => {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(DEMO_MESSAGES_STORAGE_KEY)) || {};
  } catch {
    localStorage.removeItem(DEMO_MESSAGES_STORAGE_KEY);
    return {};
  }
};

const writeDemoMessageStore = (store) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_MESSAGES_STORAGE_KEY, JSON.stringify(store));
};

export const getDemoConversation = (contactId) => {
  const key = String(contactId);
  const store = readDemoMessageStore();

  if (!store[key]) {
    store[key] = getDemoMessages(contactId);
    writeDemoMessageStore(store);
  }

  return store[key];
};

export const saveDemoConversation = (contactId, messages) => {
  const store = readDemoMessageStore();
  store[String(contactId)] = messages;
  writeDemoMessageStore(store);
};

export const createDemoMessage = ({ contactId, type, message }) => ({
  id: `${contactId}-${Date.now()}`,
  senderId: DEMO_USER.id,
  recieverId: contactId,
  type,
  message,
  messageStatus: "sent",
  createdAt: new Date().toISOString(),
});

export const addDemoMessage = (contactId, message) => {
  const messages = [...getDemoConversation(contactId), message];
  saveDemoConversation(contactId, messages);
  return messages;
};

export const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export const clearDemoData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_MESSAGES_STORAGE_KEY);
  localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
};

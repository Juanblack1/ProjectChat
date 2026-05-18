export const DEMO_USER = {
  id: 1,
  name: "Voce",
  email: "voce@projectchat.local",
  profileImage: "/default_avatar.png",
  status: "Disponivel no ProjectChat Web",
};

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days, hour = 14, minute = 20) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const DEMO_CONTACTS = [
  {
    id: 2,
    name: "Ana Produto",
    email: "ana@projectchat.local",
    profilePicture: "/avatars/2.png",
    about: "Define prioridades e roadmap",
    lastSeen: "online",
    isOnline: true,
    isTyping: true,
    unreadCount: 2,
    pinned: true,
    muted: false,
    isGroup: false,
    label: "Produto",
  },
  {
    id: 3,
    name: "Bruno Suporte",
    email: "bruno@projectchat.local",
    profilePicture: "/avatars/3.png",
    about: "Atendimento e incidentes",
    lastSeen: "visto hoje as 09:18",
    isOnline: false,
    isTyping: false,
    unreadCount: 0,
    pinned: false,
    muted: false,
    isGroup: false,
    label: "Suporte",
  },
  {
    id: 4,
    name: "Carla Design",
    email: "carla@projectchat.local",
    profilePicture: "/avatars/4.png",
    about: "UI, prototipo e handoff",
    lastSeen: "online",
    isOnline: true,
    isTyping: false,
    unreadCount: 1,
    pinned: true,
    muted: true,
    isGroup: false,
    label: "Design",
  },
  {
    id: 5,
    name: "Squad Lancamento",
    email: "squad@projectchat.local",
    profilePicture: "/avatars/5.png",
    about: "8 participantes",
    lastSeen: "grupo ativo",
    isOnline: true,
    isTyping: false,
    unreadCount: 4,
    pinned: false,
    muted: false,
    isGroup: true,
    label: "Grupo",
  },
  {
    id: 6,
    name: "Diego DevOps",
    email: "diego@projectchat.local",
    profilePicture: "/avatars/6.png",
    about: "Deploys, logs e monitoramento",
    lastSeen: "visto ontem as 22:41",
    isOnline: false,
    isTyping: false,
    unreadCount: 0,
    pinned: false,
    muted: false,
    isGroup: false,
    label: "Infra",
  },
  {
    id: 7,
    name: "Fernanda Cliente",
    email: "fernanda@projectchat.local",
    profilePicture: "/avatars/7.png",
    about: "Feedback do piloto",
    lastSeen: "visto segunda as 16:03",
    isOnline: false,
    isTyping: false,
    unreadCount: 0,
    pinned: false,
    muted: true,
    isGroup: false,
    label: "Cliente",
  },
  {
    id: 8,
    name: "Time Design",
    email: "design@projectchat.local",
    profilePicture: "/avatars/8.png",
    about: "Criticas visuais e assets",
    lastSeen: "grupo ativo",
    isOnline: true,
    isTyping: false,
    unreadCount: 0,
    pinned: false,
    muted: false,
    isGroup: true,
    label: "Grupo",
  },
  {
    id: 9,
    name: "Rafa Comercial",
    email: "rafa@projectchat.local",
    profilePicture: "/avatars/9.png",
    about: "Apresentacoes e propostas",
    lastSeen: "online",
    isOnline: true,
    isTyping: false,
    unreadCount: 3,
    pinned: false,
    muted: false,
    isGroup: false,
    label: "Comercial",
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

const DEMO_CONVERSATIONS = {
  2: [
    {id: "2-01", senderId: 2, recieverId: DEMO_USER.id, type: "text", message: "Bom dia! Atualizei o roteiro da apresentacao publica.", messageStatus: "read", createdAt: hoursAgo(3)},
    {id: "2-02", senderId: DEMO_USER.id, recieverId: 2, type: "text", message: "Otimo. Quero que pareca um produto real, mas sem expor detalhes internos.", messageStatus: "read", createdAt: hoursAgo(2.8)},
    {id: "2-03", senderId: 2, recieverId: DEMO_USER.id, type: "text", message: "Fechado. Coloquei contatos, historico, busca e perfil local.", messageStatus: "read", createdAt: minutesAgo(37)},
    {id: "2-04", senderId: 2, recieverId: DEMO_USER.id, type: "text", message: "Tambem deixei o aviso de seguranca bem discreto.", messageStatus: "delivered", createdAt: minutesAgo(8)},
  ],
  3: [
    {id: "3-01", senderId: 3, recieverId: DEMO_USER.id, type: "text", message: "Recebemos dois relatos sobre upload de imagem.", messageStatus: "read", createdAt: daysAgo(1, 10, 12)},
    {id: "3-02", senderId: DEMO_USER.id, recieverId: 3, type: "text", message: "No ambiente publico ele fica local no navegador, certo?", messageStatus: "read", createdAt: daysAgo(1, 10, 18)},
    {id: "3-03", senderId: 3, recieverId: DEMO_USER.id, type: "text", message: "Sim. Sem servidor e sem expor arquivos reais.", messageStatus: "read", createdAt: daysAgo(1, 10, 21)},
  ],
  4: [
    {id: "4-01", senderId: 4, recieverId: DEMO_USER.id, type: "text", message: "A sidebar precisa ter mais vida: horarios, badges e conversas reais.", messageStatus: "read", createdAt: hoursAgo(6)},
    {id: "4-02", senderId: DEMO_USER.id, recieverId: 4, type: "text", message: "Concordo. Tambem vou melhorar a tela vazia.", messageStatus: "read", createdAt: hoursAgo(5.7)},
    {id: "4-03", senderId: 4, recieverId: DEMO_USER.id, type: "text", message: "Perfeito. A primeira impressao vai mudar bastante.", messageStatus: "read", createdAt: minutesAgo(55)},
  ],
  5: [
    {id: "5-01", senderId: 5, recieverId: DEMO_USER.id, type: "text", message: "Ana: Alguem validou o fluxo de logout?", messageStatus: "read", createdAt: minutesAgo(42)},
    {id: "5-02", senderId: DEMO_USER.id, recieverId: 5, type: "text", message: "Sim. Limpa sessao local e volta para a tela de login.", messageStatus: "read", createdAt: minutesAgo(39)},
    {id: "5-03", senderId: 5, recieverId: DEMO_USER.id, type: "text", message: "Carla: Otimo. Vou revisar a copy da tela inicial.", messageStatus: "delivered", createdAt: minutesAgo(21)},
    {id: "5-04", senderId: 5, recieverId: DEMO_USER.id, type: "text", message: "Diego: Deploy de producao pronto para validar.", messageStatus: "sent", createdAt: minutesAgo(4)},
  ],
  6: [
    {id: "6-01", senderId: 6, recieverId: DEMO_USER.id, type: "text", message: "A Vercel esta servindo apenas o client Next.js.", messageStatus: "read", createdAt: daysAgo(2, 22, 18)},
    {id: "6-02", senderId: DEMO_USER.id, recieverId: 6, type: "text", message: "Perfeito. Dados sensiveis ficam fora do ambiente publico.", messageStatus: "read", createdAt: daysAgo(2, 22, 24)},
  ],
  7: [
    {id: "7-01", senderId: 7, recieverId: DEMO_USER.id, type: "text", message: "Gostei da experiencia. Da para ver como ficaria uma conversa real.", messageStatus: "read", createdAt: daysAgo(3, 15, 40)},
    {id: "7-02", senderId: DEMO_USER.id, recieverId: 7, type: "text", message: "Essa e a ideia: uma vitrine segura do produto.", messageStatus: "read", createdAt: daysAgo(3, 15, 43)},
  ],
  8: [
    {id: "8-01", senderId: 8, recieverId: DEMO_USER.id, type: "text", message: "Lia: O avatar editavel ficou mais natural agora.", messageStatus: "read", createdAt: daysAgo(1, 17, 12)},
    {id: "8-02", senderId: 8, recieverId: DEMO_USER.id, type: "text", message: "Carla: Vamos manter o visual escuro e denso.", messageStatus: "read", createdAt: daysAgo(1, 17, 19)},
  ],
  9: [
    {id: "9-01", senderId: 9, recieverId: DEMO_USER.id, type: "text", message: "Tenho uma apresentacao hoje. Posso usar o link publico?", messageStatus: "read", createdAt: minutesAgo(29)},
    {id: "9-02", senderId: DEMO_USER.id, recieverId: 9, type: "text", message: "Pode sim. Ele nao pede conta real e nao salva nada no servidor.", messageStatus: "read", createdAt: minutesAgo(24)},
    {id: "9-03", senderId: 9, recieverId: DEMO_USER.id, type: "text", message: "Excelente. Assim consigo mostrar o produto sem risco.", messageStatus: "delivered", createdAt: minutesAgo(12)},
  ],
};

export const getDemoMessages = (contactId) => DEMO_CONVERSATIONS[contactId] || [
  {
    id: `${contactId}-01`,
    senderId: contactId,
    recieverId: DEMO_USER.id,
    type: "text",
    message: "Oi! Esta conversa roda localmente no navegador.",
    messageStatus: "read",
    createdAt: minutesAgo(12),
  },
  {
    id: `${contactId}-02`,
    senderId: DEMO_USER.id,
    recieverId: contactId,
    type: "text",
    message: "Perfeito. O ambiente publico segue seguro e sem dados reais.",
    messageStatus: "read",
    createdAt: minutesAgo(8),
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

export const getDemoConversationPreview = (contact) => {
  const conversation = getDemoConversation(contact.id);
  const lastMessage = conversation[conversation.length - 1];

  if (!lastMessage) {
    return {
      text: "Conversa limpa",
      createdAt: null,
      messageStatus: null,
      fromSelf: false,
    };
  }

  return {
    text: lastMessage.type === "image" ? "Foto" : lastMessage.type === "audio" ? "Audio" : lastMessage.message,
    createdAt: lastMessage.createdAt,
    messageStatus: lastMessage.messageStatus,
    fromSelf: lastMessage.senderId === DEMO_USER.id,
  };
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

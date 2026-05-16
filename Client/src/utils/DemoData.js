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

export const DEMO_CONTACT_GROUPS = DEMO_CONTACTS.reduce((groups, contact) => {
  const initial = contact.name.charAt(0).toUpperCase();
  groups[initial] = [...(groups[initial] || []), contact];
  return groups;
}, {});

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

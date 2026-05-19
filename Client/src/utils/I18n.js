export const DEFAULT_LANGUAGE = "pt-BR";
export const LANGUAGE_STORAGE_KEY = "projectchat-language";

export const LANGUAGES = [
  { value: "pt-BR", label: "PT-BR" },
  { value: "en", label: "English" },
];

const dictionaries = {
  "pt-BR": {
    "common.projectChat": "ProjectChat",
    "common.projectChatWeb": "ProjectChat Web",
    "common.loading": "Carregando seu ambiente de conversa...",
    "common.language": "Idioma",
    "common.user": "Usuario",
    "common.available": "Disponivel",
    "common.cancel": "Cancelar",
    "common.save": "Salvar",
    "common.saving": "Salvando...",
    "common.send": "Enviar",
    "common.processing": "Processando...",
    "common.email": "Email",
    "common.password": "Senha",
    "date.yesterday": "Ontem",

    "auth.recoveryPrompt": "Digite uma nova senha para concluir a recuperacao da conta.",
    "auth.signupConfirmedPrompt": "Email confirmado. Crie sua senha para concluir o cadastro.",
    "auth.unavailable": "Servico de autenticacao indisponivel. Tente novamente em instantes.",
    "auth.recoveryLinkSent": "Enviamos um link de recuperacao para o seu email.",
    "auth.signupLinkSent": "Enviamos um link de verificacao para o seu email.",
    "auth.passwordMin": "A nova senha precisa ter pelo menos 6 caracteres.",
    "auth.passwordMismatch": "As senhas nao conferem.",
    "auth.passwordUpdated": "Senha atualizada. Entre novamente com sua nova senha.",
    "auth.checkEmail": "Verifique seu email para continuar.",
    "auth.genericError": "Nao foi possivel concluir a acao. Tente novamente.",
    "auth.tagline": "Chat em tempo real",
    "auth.heroTitle": "Comunicacao em tempo real para equipes.",
    "auth.heroDemoText": "Acesse um ambiente local para conhecer a experiencia do ProjectChat.",
    "auth.heroText": "Acesse suas conversas, contatos e mensagens em um ambiente seguro e sincronizado.",
    "auth.cardConversationsTitle": "Conversas organizadas",
    "auth.cardConversationsText": "Contatos, busca, filtros e anexos em uma unica area de trabalho.",
    "auth.cardSecureTitle": "Acesso seguro",
    "auth.cardSecureText": "Login por email e senha com sessao protegida.",
    "auth.realtimeNote": "Mensagens sincronizadas em tempo real entre usuarios autorizados.",
    "auth.accessProfessional": "Acesso profissional",
    "auth.namePlaceholder": "Seu nome",
    "auth.newPassword": "Nova senha",
    "auth.confirmNewPassword": "Confirmar nova senha",
    "auth.emailConfirmed": "Email confirmado:",
    "auth.enter": "Entrar",
    "auth.enterDemo": "Entrar no ProjectChat",
    "auth.createAccount": "Criar uma nova conta",
    "auth.sendVerificationLink": "Enviar link de verificacao",
    "auth.sendLink": "Enviar link",
    "auth.updatePassword": "Atualizar senha",
    "auth.completeSignup": "Concluir cadastro",
    "auth.forgotPassword": "Esqueci minha senha",
    "auth.backToSignin": "Voltar para entrar",

    "error.newPasswordDifferent": "A nova senha deve ser diferente da senha atual.",
    "error.invalidCredentials": "Email ou senha invalidos.",
    "error.emailNotConfirmed": "Confirme seu email antes de entrar.",
    "error.userAlreadyRegistered": "Este email ja esta cadastrado.",
    "error.rateLimit": "Aguarde alguns instantes antes de tentar novamente.",
    "error.invalidEmail": "Informe um email valido.",
    "error.weakPassword": "Use uma senha mais forte.",
    "error.sessionExpired": "Sua sessao expirou. Entre novamente.",

    "presence.offline": "offline",
    "presence.online": "online",
    "presence.typing": "digitando...",
    "presence.recently": "visto recentemente",
    "presence.now": "visto agora",
    "presence.minutesAgo": "visto ha {minutes} min",
    "presence.todayAt": "visto hoje as {time}",
    "presence.dateAt": "visto em {date} as {time}",

    "chat.today": "Hoje",
    "chat.localNotice": "Ambiente local ativo. As conversas ficam neste navegador.",
    "chat.realtimeNotice": "Mensagens sincronizadas em tempo real entre os participantes.",
    "chat.loadingMessages": "Carregando mensagens...",
    "chat.emptyConversation": "Nenhuma mensagem ainda. Envie a primeira mensagem para iniciar a conversa.",
    "chat.clearConversation": "Limpar conversa",
    "chat.searchMessages": "Pesquisar mensagens",
    "chat.searchInConversation": "Pesquisar nesta conversa",
    "chat.searchMessagesFrom": "Pesquisar mensagens de {name}",
    "chat.messageNotFound": "Mensagem nao encontrada",
    "chat.menu": "Menu da conversa",
    "chat.messagePlaceholder": "Mensagem",
    "chat.attachFile": "Anexar arquivo",
    "chat.record": "Gravar",
    "chat.sendMessageError": "Nao foi possivel enviar a mensagem. Tente novamente.",
    "chat.sendImageError": "Nao foi possivel enviar a imagem. Tente novamente.",
    "chat.aiThinking": "ProjectChat AI esta digitando...",
    "chat.aiPlaceholder": "Pergunte ao ProjectChat AI",
    "chat.aiError": "Nao consegui responder agora. Tente novamente em instantes.",
    "chat.aiNotConfigured": "Estou quase pronto para conversar. Minha conexao ainda esta sendo ativada.",
    "chat.imageAlt": "Imagem enviada",
    "chat.prepareImage": "Preparar imagem",
    "chat.sendImage": "Enviar imagem",
    "chat.viewImage": "Visualizar imagem",
    "chat.saveDrawing": "Salvar rabisco",
    "chat.removeDrawings": "Remover rabiscos",

    "image.title": "Imagem",
    "image.save": "Salvar",
    "image.help": "Use zoom para aproximar e rabisque quando quiser marcar algo.",
    "image.loadError": "Nao foi possivel carregar a imagem.",
    "image.saveError": "Nao foi possivel salvar a anotacao neste navegador.",
    "image.drawingOn": "Rabiscando",
    "image.draw": "Rabiscar",
    "image.undo": "Desfazer",
    "image.clear": "Limpar",
    "image.color": "Cor",
    "image.brush": "Pincel",

    "contacts.newConversation": "Nova conversa",
    "contacts.available": "{count} contatos disponiveis",
    "contacts.search": "Pesquisar contatos",
    "contacts.noneFound": "Nenhum contato encontrado.",
    "contacts.noneAvailable": "Nenhum contato disponivel no momento.",
    "contacts.noneForFilter": "Nenhuma conversa encontrada para esse filtro.",
    "contacts.loadError": "Nao foi possivel carregar contatos.",
    "contacts.label": "Contato",
    "contacts.searchConversation": "Pesquisar ou comecar uma nova conversa",
    "contacts.all": "Todos",
    "contacts.unread": "Nao lidas",
    "contacts.favorites": "Favoritos",
    "contacts.groups": "Grupos",
    "contacts.photo": "Foto",
    "contacts.audio": "Audio",
    "contacts.aiStatus": "Assistente online",
    "contacts.aiWelcome": "Oi, sou o ProjectChat AI. Como posso ajudar?",
    "contacts.noMessages": "Sem mensagens ainda",
    "contacts.clearedConversation": "Conversa limpa",
    "contacts.pinned": "Fixado",
    "contacts.muted": "Sil.",

    "profile.myProfile": "Meu perfil",
    "profile.title": "Meu perfil",
    "profile.description": "Personalize sua identidade no ProjectChat.",
    "profile.name": "Nome",
    "profile.about": "Recado",
    "profile.save": "Salvar perfil",
    "profile.saveError": "Nao foi possivel salvar o perfil.",
    "profile.changePhoto": "Altere sua foto de perfil",
    "profile.takePhoto": "Tirar Foto",
    "profile.chooseLibrary": "Escolher Da Biblioteca",
    "profile.uploadPhoto": "Enviar Foto",
    "profile.removePhoto": "Remover Foto",

    "sidebar.logout": "Sair",
    "sidebar.restoreConversations": "Restaurar conversas",
    "sidebar.newConversation": "Nova conversa",

    "empty.description": "Selecione uma conversa para visualizar mensagens, responder contatos e acompanhar novas atualizacoes.",
    "empty.secureTitle": "Acesso seguro",
    "empty.secureText": "Sessao protegida",
    "empty.flowsTitle": "Fluxos reais",
    "empty.flowsText": "Mensagens, busca e perfil",
    "empty.contactsTitle": "Contatos ativos",
    "empty.contactsText": "Lista sincronizada",
    "empty.footer": "Suas conversas permanecem disponiveis em tempo real.",

    "audio.microphonePermission": "Permita o uso do microfone para gravar audio.",
    "audio.sendError": "Nao foi possivel enviar o audio. Tente novamente.",
    "audio.recording": "Gravando",
  },
  en: {
    "common.projectChat": "ProjectChat",
    "common.projectChatWeb": "ProjectChat Web",
    "common.loading": "Loading your chat workspace...",
    "common.language": "Language",
    "common.user": "User",
    "common.available": "Available",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.saving": "Saving...",
    "common.send": "Send",
    "common.processing": "Processing...",
    "common.email": "Email",
    "common.password": "Password",
    "date.yesterday": "Yesterday",

    "auth.recoveryPrompt": "Enter a new password to finish account recovery.",
    "auth.signupConfirmedPrompt": "Email confirmed. Create your password to finish registration.",
    "auth.unavailable": "Authentication service is unavailable. Try again shortly.",
    "auth.recoveryLinkSent": "We sent a recovery link to your email.",
    "auth.signupLinkSent": "We sent a verification link to your email.",
    "auth.passwordMin": "The new password must have at least 6 characters.",
    "auth.passwordMismatch": "Passwords do not match.",
    "auth.passwordUpdated": "Password updated. Sign in again with your new password.",
    "auth.checkEmail": "Check your email to continue.",
    "auth.genericError": "We could not complete the action. Try again.",
    "auth.tagline": "Real-time chat",
    "auth.heroTitle": "Real-time communication for teams.",
    "auth.heroDemoText": "Open a local workspace to explore ProjectChat.",
    "auth.heroText": "Access your conversations, contacts, and messages in a secure synchronized workspace.",
    "auth.cardConversationsTitle": "Organized conversations",
    "auth.cardConversationsText": "Contacts, search, filters, and attachments in one workspace.",
    "auth.cardSecureTitle": "Secure access",
    "auth.cardSecureText": "Email and password sign-in with protected sessions.",
    "auth.realtimeNote": "Messages sync in real time between authorized users.",
    "auth.accessProfessional": "Professional access",
    "auth.namePlaceholder": "Your name",
    "auth.newPassword": "New password",
    "auth.confirmNewPassword": "Confirm new password",
    "auth.emailConfirmed": "Email confirmed:",
    "auth.enter": "Sign in",
    "auth.enterDemo": "Enter ProjectChat",
    "auth.createAccount": "Create a new account",
    "auth.sendVerificationLink": "Send verification link",
    "auth.sendLink": "Send link",
    "auth.updatePassword": "Update password",
    "auth.completeSignup": "Finish registration",
    "auth.forgotPassword": "Forgot my password",
    "auth.backToSignin": "Back to sign in",

    "error.newPasswordDifferent": "The new password must be different from the current password.",
    "error.invalidCredentials": "Invalid email or password.",
    "error.emailNotConfirmed": "Confirm your email before signing in.",
    "error.userAlreadyRegistered": "This email is already registered.",
    "error.rateLimit": "Wait a moment before trying again.",
    "error.invalidEmail": "Enter a valid email address.",
    "error.weakPassword": "Use a stronger password.",
    "error.sessionExpired": "Your session expired. Sign in again.",

    "presence.offline": "offline",
    "presence.online": "online",
    "presence.typing": "typing...",
    "presence.recently": "seen recently",
    "presence.now": "seen just now",
    "presence.minutesAgo": "seen {minutes} min ago",
    "presence.todayAt": "seen today at {time}",
    "presence.dateAt": "seen on {date} at {time}",

    "chat.today": "Today",
    "chat.localNotice": "Local workspace active. Conversations stay in this browser.",
    "chat.realtimeNotice": "Messages sync in real time between participants.",
    "chat.loadingMessages": "Loading messages...",
    "chat.emptyConversation": "No messages yet. Send the first message to start the conversation.",
    "chat.clearConversation": "Clear conversation",
    "chat.searchMessages": "Search messages",
    "chat.searchInConversation": "Search in this conversation",
    "chat.searchMessagesFrom": "Search messages from {name}",
    "chat.messageNotFound": "Message not found",
    "chat.menu": "Chat menu",
    "chat.messagePlaceholder": "Message",
    "chat.attachFile": "Attach file",
    "chat.record": "Record",
    "chat.sendMessageError": "Could not send the message. Try again.",
    "chat.sendImageError": "Could not send the image. Try again.",
    "chat.aiThinking": "ProjectChat AI is typing...",
    "chat.aiPlaceholder": "Ask ProjectChat AI",
    "chat.aiError": "I could not answer right now. Try again shortly.",
    "chat.aiNotConfigured": "I am almost ready to chat. My connection is still being activated.",
    "chat.imageAlt": "Sent image",
    "chat.prepareImage": "Prepare image",
    "chat.sendImage": "Send image",
    "chat.viewImage": "View image",
    "chat.saveDrawing": "Save drawing",
    "chat.removeDrawings": "Remove drawings",

    "image.title": "Image",
    "image.save": "Save",
    "image.help": "Use zoom to get closer and draw whenever you want to mark something.",
    "image.loadError": "Could not load the image.",
    "image.saveError": "Could not save the annotation in this browser.",
    "image.drawingOn": "Drawing",
    "image.draw": "Draw",
    "image.undo": "Undo",
    "image.clear": "Clear",
    "image.color": "Color",
    "image.brush": "Brush",

    "contacts.newConversation": "New conversation",
    "contacts.available": "{count} contacts available",
    "contacts.search": "Search contacts",
    "contacts.noneFound": "No contacts found.",
    "contacts.noneAvailable": "No contacts available right now.",
    "contacts.noneForFilter": "No conversations found for this filter.",
    "contacts.loadError": "Could not load contacts.",
    "contacts.label": "Contact",
    "contacts.searchConversation": "Search or start a new conversation",
    "contacts.all": "All",
    "contacts.unread": "Unread",
    "contacts.favorites": "Favorites",
    "contacts.groups": "Groups",
    "contacts.photo": "Photo",
    "contacts.audio": "Audio",
    "contacts.aiStatus": "AI assistant online",
    "contacts.aiWelcome": "Hi, I am ProjectChat AI. How can I help?",
    "contacts.noMessages": "No messages yet",
    "contacts.clearedConversation": "Cleared conversation",
    "contacts.pinned": "Pinned",
    "contacts.muted": "Muted",

    "profile.myProfile": "My profile",
    "profile.title": "My profile",
    "profile.description": "Personalize your ProjectChat identity.",
    "profile.name": "Name",
    "profile.about": "About",
    "profile.save": "Save profile",
    "profile.saveError": "Could not save the profile.",
    "profile.changePhoto": "Change your profile photo",
    "profile.takePhoto": "Take photo",
    "profile.chooseLibrary": "Choose from library",
    "profile.uploadPhoto": "Upload photo",
    "profile.removePhoto": "Remove photo",

    "sidebar.logout": "Sign out",
    "sidebar.restoreConversations": "Restore conversations",
    "sidebar.newConversation": "New conversation",

    "empty.description": "Select a conversation to view messages, reply to contacts, and follow new updates.",
    "empty.secureTitle": "Secure access",
    "empty.secureText": "Protected session",
    "empty.flowsTitle": "Real flows",
    "empty.flowsText": "Messages, search, and profile",
    "empty.contactsTitle": "Active contacts",
    "empty.contactsText": "Synced list",
    "empty.footer": "Your conversations stay available in real time.",

    "audio.microphonePermission": "Allow microphone access to record audio.",
    "audio.sendError": "Could not send the audio. Try again.",
    "audio.recording": "Recording",
  },
};

const replaceParams = (value, params = {}) => Object.entries(params).reduce(
  (text, [key, paramValue]) => text.replaceAll(`{${key}}`, String(paramValue)),
  value
);

export const normalizeLanguage = (language) => (dictionaries[language] ? language : DEFAULT_LANGUAGE);

export const translate = (key, language = DEFAULT_LANGUAGE, params = {}) => {
  const normalized = normalizeLanguage(language);
  const value = dictionaries[normalized][key] || dictionaries[DEFAULT_LANGUAGE][key] || key;
  return replaceParams(value, params);
};

export const getStoredLanguage = () => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
};

export const saveStoredLanguage = (language) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
};

export const translateAuthError = (error, language = DEFAULT_LANGUAGE) => {
  const message = typeof error === "string" ? error : error?.message;
  if (!message) return translate("auth.genericError", language);

  const normalized = message.toLowerCase();
  const rules = [
    ["new password should be different", "error.newPasswordDifferent"],
    ["invalid login credentials", "error.invalidCredentials"],
    ["email not confirmed", "error.emailNotConfirmed"],
    ["already registered", "error.userAlreadyRegistered"],
    ["for security purposes", "error.rateLimit"],
    ["invalid email", "error.invalidEmail"],
    ["weak password", "error.weakPassword"],
    ["password should", "auth.passwordMin"],
    ["refresh token", "error.sessionExpired"],
  ];

  const match = rules.find(([fragment]) => normalized.includes(fragment));
  if (match) return translate(match[1], language);

  return translate("auth.genericError", language);
};

export const formatPresence = (lastSeen, language = DEFAULT_LANGUAGE) => {
  if (!lastSeen) return translate("presence.offline", language);
  const date = new Date(lastSeen);
  if (Number.isNaN(date.getTime())) return lastSeen;

  const diffMs = Date.now() - date.getTime();
  if (diffMs <= 90 * 1000) return translate("presence.online", language);
  if (diffMs < 5 * 60 * 1000) return translate("presence.now", language);
  if (diffMs < 60 * 60 * 1000) {
    return translate("presence.minutesAgo", language, { minutes: Math.floor(diffMs / 60000) });
  }

  const locale = language === "en" ? "en-US" : "pt-BR";
  const today = new Date();
  const time = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  if (date.toDateString() === today.toDateString()) {
    return translate("presence.todayAt", language, { time });
  }

  const formattedDate = date.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" });
  return translate("presence.dateAt", language, { date: formattedDate, time });
};

import { supabase } from "./SupabaseConfig";

const DEFAULT_AVATAR = "/default_avatar.png";
const ONLINE_WINDOW_MS = 90 * 1000;

const getLastSeenDate = (lastSeen) => {
  if (!lastSeen) return null;
  const date = new Date(lastSeen);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isProfileOnline = (lastSeen) => {
  const date = getLastSeenDate(lastSeen);
  return date ? Date.now() - date.getTime() <= ONLINE_WINDOW_MS : false;
};

export const formatPresence = (lastSeen) => {
  const date = getLastSeenDate(lastSeen);
  if (!date) return "offline";

  const diffMs = Date.now() - date.getTime();
  if (diffMs <= ONLINE_WINDOW_MS) return "online";
  if (diffMs < 5 * 60 * 1000) return "visto agora";
  if (diffMs < 60 * 60 * 1000) return `visto ha ${Math.floor(diffMs / 60000)} min`;

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (isToday) return `visto hoje as ${time}`;
  return `visto em ${date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} as ${time}`;
};

export const mapProfileToUser = (profile) => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  profileImage: profile.profile_picture || DEFAULT_AVATAR,
  profilePicture: profile.profile_picture || DEFAULT_AVATAR,
  status: profile.about || "Disponivel",
  about: profile.about || "Disponivel",
  lastSeenAt: profile.last_seen,
  lastSeen: formatPresence(profile.last_seen),
  isOnline: isProfileOnline(profile.last_seen),
});

export const mapMessageFromRow = (message) => ({
  id: message.id,
  senderId: message.sender_id,
  recieverId: message.receiver_id,
  type: message.type,
  message: message.body,
  messageStatus: message.status,
  createdAt: message.created_at,
});

export const ensureProfile = async (authUser, overrides = {}) => {
  if (!supabase || !authUser?.id) return null;

  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("id,email,name,profile_picture,about,last_seen")
    .eq("id", authUser.id)
    .maybeSingle();

  if (selectError) throw selectError;

  if (existingProfile) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ last_seen: new Date().toISOString() })
      .eq("id", authUser.id)
      .select()
      .single();

    if (error) throw error;
    return mapProfileToUser(data);
  }

  const profile = {
    id: authUser.id,
    email: authUser.email,
    name: overrides.name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Usuario",
    profile_picture: overrides.profileImage || authUser.user_metadata?.avatar_url || DEFAULT_AVATAR,
    about: overrides.status || "Disponivel",
    last_seen: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return mapProfileToUser(data);
};

export const updateProfile = async (userId, profile) => {
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: profile.name,
      about: profile.status,
      profile_picture: profile.profileImage,
      last_seen: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return mapProfileToUser(data);
};

export const updateLastSeen = async (userId) => {
  if (!supabase || !userId) return;

  await supabase
    .from("profiles")
    .update({ last_seen: new Date().toISOString() })
    .eq("id", userId);
};

export const getContacts = async (currentUserId) => {
  if (!supabase || !currentUserId) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,name,profile_picture,about,last_seen")
    .neq("id", currentUserId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data.map(mapProfileToUser);
};

export const getContactsWithPreviews = async (currentUserId) => {
  const contacts = await getContacts(currentUserId);
  if (!supabase || !currentUserId || !contacts.length) return contacts;

  const { data, error } = await supabase
    .from("messages")
    .select("id,sender_id,receiver_id,type,body,status,created_at")
    .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;

  const latestByContact = new Map();
  const unreadByContact = new Map();

  data.forEach((message) => {
    const contactId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
    if (!latestByContact.has(contactId)) latestByContact.set(contactId, message);
    if (message.receiver_id === currentUserId && message.status !== "read") {
      unreadByContact.set(contactId, (unreadByContact.get(contactId) || 0) + 1);
    }
  });

  return contacts.map((contact) => {
    const latest = latestByContact.get(contact.id);
    return {
      ...contact,
      message: latest?.body || contact.about,
      type: latest?.type || "text",
      messageStatus: latest?.status,
      createdAt: latest?.created_at,
      senderId: latest?.sender_id,
      recieverId: latest?.receiver_id,
      totalUnreadMessages: unreadByContact.get(contact.id) || 0,
      unreadCount: unreadByContact.get(contact.id) || 0,
      label: "Contato",
    };
  });
};

export const getConversationMessages = async (currentUserId, contactId) => {
  if (!supabase || !currentUserId || !contactId) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("id,sender_id,receiver_id,type,body,status,created_at")
    .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${currentUserId})`)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map(mapMessageFromRow);
};

export const sendMessage = async ({ from, to, message, type = "text" }) => {
  if (!supabase || !from || !to || !message) return null;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: from,
      receiver_id: to,
      body: message,
      type,
      status: "sent",
    })
    .select()
    .single();

  if (error) throw error;
  return mapMessageFromRow(data);
};

export const markConversationRead = async (currentUserId, contactId) => {
  if (!supabase || !currentUserId || !contactId) return;

  await supabase
    .from("messages")
    .update({ status: "read" })
    .eq("sender_id", contactId)
    .eq("receiver_id", currentUserId)
    .neq("status", "read");
};

export const subscribeToMessages = (currentUserId, contactId, onMessage) => {
  if (!supabase || !currentUserId || !contactId) return () => {};

  const channel = supabase
    .channel(`messages:${currentUserId}:${contactId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => {
        const message = payload.new;
        const isCurrentConversation = (
          (message.sender_id === currentUserId && message.receiver_id === contactId) ||
          (message.sender_id === contactId && message.receiver_id === currentUserId)
        );

        if (isCurrentConversation) onMessage(mapMessageFromRow(message));
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export const subscribeToProfiles = (onChange) => {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("profiles")
    .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, onChange)
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export const subscribeToUserMessages = (currentUserId, onChange) => {
  if (!supabase || !currentUserId) return () => {};

  const channel = supabase
    .channel(`user-messages:${currentUserId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (payload) => {
        const row = payload.new?.id ? payload.new : payload.old;
        if (row?.sender_id === currentUserId || row?.receiver_id === currentUserId) {
          onChange(payload);
        }
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};

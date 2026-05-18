import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { DEMO_CONTACTS } from "@/utils/DemoData";
import { getContactsWithPreviews, subscribeToProfiles, subscribeToUserMessages } from "@/utils/SupabaseChat";
import { useEffect, useState } from "react";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const [{contactSearch, contactFilter, messages, userInfo}] = useStateProvider();
  const [realContacts, setRealContacts] = useState([]);
  const [error, setError] = useState("");
  const normalizedSearch = contactSearch.trim().toLowerCase();

  useEffect(() => {
    if (IS_DEMO_MODE || !userInfo?.id) return;

    let active = true;
    const loadContacts = async () => {
      try {
        const contacts = await getContactsWithPreviews(userInfo.id);
        if (active) {
          setRealContacts(contacts);
          setError("");
        }
      } catch (err) {
        if (active) setError(err.message || "Nao foi possivel carregar contatos.");
      }
    };

    loadContacts();
    const unsubscribeProfiles = subscribeToProfiles(loadContacts);
    const unsubscribeMessages = subscribeToUserMessages(userInfo.id, loadContacts);

    return () => {
      active = false;
      unsubscribeProfiles();
      unsubscribeMessages();
    };
  }, [messages, userInfo?.id]);

  const sourceContacts = IS_DEMO_MODE ? DEMO_CONTACTS : realContacts;
  const contacts = sourceContacts.filter((contact) => {
    const matchesSearch = !normalizedSearch ||
      contact.name.toLowerCase().includes(normalizedSearch) ||
      contact.about.toLowerCase().includes(normalizedSearch) ||
      contact.label?.toLowerCase().includes(normalizedSearch);

    const matchesFilter = contactFilter === "all" ||
      (contactFilter === "unread" && (contact.unreadCount > 0 || contact.totalUnreadMessages > 0)) ||
      (contactFilter === "pinned" && contact.pinned) ||
      (contactFilter === "groups" && contact.isGroup);

    return matchesSearch && matchesFilter;
  });

  return( 
  <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
    {contacts.map((contact) => (
      <ChatLIstItem data={contact} key={contact.id} />
    ))}
    {!IS_DEMO_MODE && error && (
      <div className="text-red-300 text-sm px-8 py-6 text-center">
        {error}
      </div>
    )}
    {contacts.length === 0 && !error && (
      <div className="text-secondary text-sm px-8 py-12 text-center">
        {IS_DEMO_MODE ? "Nenhuma conversa encontrada para esse filtro." : "Nenhum contato disponivel no momento."}
      </div>
    )}
  </div>
  );
}

export default List;

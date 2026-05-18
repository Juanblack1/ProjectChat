import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { DEMO_CONTACTS } from "@/utils/DemoData";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const [{contactSearch, contactFilter, messages}] = useStateProvider();
  const normalizedSearch = contactSearch.trim().toLowerCase();
  const contacts = DEMO_CONTACTS.filter((contact) => {
    const matchesSearch = !normalizedSearch ||
      contact.name.toLowerCase().includes(normalizedSearch) ||
      contact.about.toLowerCase().includes(normalizedSearch) ||
      contact.label.toLowerCase().includes(normalizedSearch);

    const matchesFilter = contactFilter === "all" ||
      (contactFilter === "unread" && contact.unreadCount > 0) ||
      (contactFilter === "pinned" && contact.pinned) ||
      (contactFilter === "groups" && contact.isGroup);

    return matchesSearch && matchesFilter;
  });

  // Re-render previews after a message is sent in the open conversation.
  void messages;

  return( 
  <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
    {IS_DEMO_MODE && contacts.map((contact) => (
      <ChatLIstItem data={contact} key={contact.id} />
    ))}
    {IS_DEMO_MODE && contacts.length === 0 && (
      <div className="text-secondary text-sm px-8 py-12 text-center">
        Nenhuma conversa encontrada para esse filtro.
      </div>
    )}
  </div>
  );
}

export default List;

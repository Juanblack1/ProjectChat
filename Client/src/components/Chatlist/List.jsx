import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { DEMO_CONTACTS } from "@/utils/DemoData";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  const [{contactSearch}] = useStateProvider();
  const normalizedSearch = contactSearch.trim().toLowerCase();
  const contacts = normalizedSearch
    ? DEMO_CONTACTS.filter((contact) => (
      contact.name.toLowerCase().includes(normalizedSearch) ||
      contact.about.toLowerCase().includes(normalizedSearch)
    ))
    : DEMO_CONTACTS;

  return( 
  <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
    {IS_DEMO_MODE && contacts.map((contact) => (
      <ChatLIstItem data={contact} key={contact.id} />
    ))}
  </div>
  );
}

export default List;

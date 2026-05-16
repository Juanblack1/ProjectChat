
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { DEMO_CONTACTS } from "@/utils/DemoData";
import ChatLIstItem from "./ChatLIstItem";

function List() {
  return( 
  <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
    {IS_DEMO_MODE && DEMO_CONTACTS.map((contact) => (
      <ChatLIstItem data={contact} key={contact.id} />
    ))}
  </div>
  );
}

export default List;

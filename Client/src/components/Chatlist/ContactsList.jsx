import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { DEMO_CONTACT_GROUPS } from "@/utils/DemoData";
import { getContacts, subscribeToProfiles } from "@/utils/SupabaseChat";
import { useI18n } from "@/utils/useI18n";
import { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [{userInfo}, dispatch] = useStateProvider();
  const { t } = useI18n();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleContacts = Object.entries(allContacts).reduce((groups, [initialLetter, userList]) => {
    const contacts = normalizedSearch
      ? userList.filter((contact) => (
        contact.name.toLowerCase().includes(normalizedSearch) ||
        contact.about.toLowerCase().includes(normalizedSearch)
      ))
      : userList;

    if (contacts.length) groups[initialLetter] = contacts;
    return groups;
  }, {});

  useEffect(() => {
    if (IS_DEMO_MODE) {
      setAllContacts(DEMO_CONTACT_GROUPS);
      return;
    }

    const loadContacts = async () => {
      if (!userInfo?.id) return;
      const contacts = await getContacts(userInfo.id);
      const groupedContacts = contacts.reduce((groups, contact) => {
        const initial = contact.name.charAt(0).toUpperCase();
        groups[initial] = [...(groups[initial] || []), contact];
        return groups;
      }, {});
      setAllContacts(groupedContacts);
    };
    loadContacts();
    const presenceInterval = setInterval(loadContacts, 30000);
    const unsubscribe = subscribeToProfiles(loadContacts);
    return () => {
      clearInterval(presenceInterval);
      unsubscribe();
    };
  }, [userInfo?.id])

  return (
  <div className="h-full flex flex-col bg-search-input-container-background">
    <div className="h-24 flex items-end px-4 py-4 bg-panel-header-background border-b border-conversation-border">
      <div className="flex items-center gap-8 text-white">
        <BiArrowBack
        className="cursor-pointer text-2xl text-panel-header-icon hover:text-primary-strong"
        onClick={() => dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE})
      }
        />
        <div>
          <div className="text-lg font-semibold">{t("contacts.newConversation")}</div>
          <div className="text-xs text-secondary">{t("contacts.available", {count: Object.values(allContacts).flat().length})}</div>
        </div>
      </div>
    </div>
    <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
      <div className="flex py-3 items-center gap-3 h-16 px-4">
        <div className="bg-panel-header-background flex items-center gap-4 px-4 py-2 rounded-lg flex-grow">
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
          <input
            type="text"
            placeholder={t("contacts.search")}
            className="bg-transparent text-sm focus:outline-none text-white w-full placeholder:text-secondary"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
      {
        Object.entries(visibleContacts).map(([initialLetter, userList]) => {
          return (
            <div key={initialLetter}>
              <div className="text-teal-light pl-10 py-4 text-sm font-semibold">{initialLetter}</div>
              {
                userList.map((contact) => {
                  return (<ChatLIstItem
                  data={contact}
                  isContactsPage={true}
                  key={contact.id}
                  />)
                })
              }
            </div>)
        })
      }
      {Object.keys(visibleContacts).length === 0 && (
        <div className="text-secondary text-sm px-8 py-12 text-center">{t("contacts.noneFound")}</div>
      )}
    </div>    
  </div>
  );
}

export default ContactsList;

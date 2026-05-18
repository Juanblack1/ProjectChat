import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { clearDemoData, endDemoSession, getDemoConversation, getDemoProfile } from "@/utils/DemoData";
import { supabase } from "@/utils/SupabaseConfig";
import { useI18n } from "@/utils/useI18n";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import Avatar from "../common/Avatar";
import ContextMenu from "../common/ContextMenu";
import LanguageSelector from "../common/LanguageSelector";
import ProfileSettings from "./ProfileSettings";

function ChatListHeader() {
  const [{userInfo, currentChatUser}, dispatch] = useStateProvider();
  const { t } = useI18n();
  const router = useRouter();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({x: 0, y: 0});

  const handleAllContactsPage = () => {
    dispatch({
      type:reducerCases.SET_ALL_CONTACTS_PAGE
    })
  }

  const showContextMenu = (event) => {
    event.preventDefault();
    setContextMenuCordinates({x: event.clientX, y: event.clientY});
    setIsContextMenuVisible(true);
  };

  const logout = async () => {
    if (IS_DEMO_MODE) {
      clearDemoData();
      endDemoSession();
    } else if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/login").then(() => {
      dispatch({type: reducerCases.SET_USER_INFO, userInfo: undefined});
      dispatch({type: reducerCases.SET_MESSAGES, messages: []});
    });
  };

  const resetDemo = () => {
    if (!IS_DEMO_MODE) return;
    clearDemoData();
    dispatch({type: reducerCases.SET_USER_INFO, userInfo: getDemoProfile()});
    dispatch({
      type: reducerCases.SET_MESSAGES,
      messages: currentChatUser ? getDemoConversation(currentChatUser.id) : [],
    });
  };

  const menuOptions = [
    {name: t("sidebar.logout"), callback: logout},
    ...(IS_DEMO_MODE ? [{name: t("sidebar.restoreConversations"), callback: resetDemo}] : []),
  ];

  return( 
  <>
  <div className="h-[76px] px-4 py-3 flex justify-between items-center bg-panel-header-background border-b border-conversation-border">
    <div className="flex items-center gap-3 cursor-pointer min-w-0" title={t("profile.myProfile")} onClick={() => setIsProfileOpen(true)}>
      <Avatar type="sm" image={userInfo?.profileImage} />
      <div className="min-w-0">
        <div className="text-primary-strong font-semibold leading-5 truncate">ProjectChat</div>
        <div className="text-secondary text-xs truncate">{userInfo?.name || t("common.user")}</div>
      </div>
    </div>
    <div className="flex gap-4 items-center">
      <LanguageSelector compact />
      <BsFillChatLeftTextFill 
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      title={t("sidebar.newConversation")}
      onClick={handleAllContactsPage}
      />
      <>
      <BsThreeDotsVertical  
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      id="context-opener"
      title={t("chat.menu")}
      onClick={showContextMenu}
      />
      </>
    </div>
  </div>
  {isContextMenuVisible && <ContextMenu
    options={menuOptions}
    cordinates={contextMenuCordinates}
    contextMenu={isContextMenuVisible}
    setContextMenu={setIsContextMenuVisible}
  />}
  {isProfileOpen && <ProfileSettings onClose={() => setIsProfileOpen(false)} />}
  </>
  );
}

export default ChatListHeader;

import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { clearDemoData } from "@/utils/DemoData";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import Avatar from "../common/Avatar";
import ContextMenu from "../common/ContextMenu";

function ChatListHeader() {
  const [{userInfo}, dispatch] = useStateProvider();
  const router = useRouter();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({x: 0, y: 0});

  const handleAllContactsPage = () => {
    dispatch({
      type:reducerCases.SET_ALL_CONTACTS_PAGE
    })
  }

  const showContextMenu = (event) => {
    event.preventDefault();
    setContextMenuCordinates({x: event.pageX, y: event.pageY});
    setIsContextMenuVisible(true);
  };

  const logout = () => {
    clearDemoData();
    dispatch({type: reducerCases.SET_USER_INFO, userInfo: undefined});
    dispatch({type: reducerCases.SET_MESSAGES, messages: []});
    router.push("/login");
  };

  const menuOptions = [
    {name: "Sair da demo", callback: logout},
    {name: "Resetar demo", callback: clearDemoData},
  ];

  return( 
  <>
  <div className="h-16 px-4 py-3 flex justify-between items-center">
    <div className="cursor-pointer">
      <Avatar type="sm" image={userInfo?.profileImage} />
    </div>
    <div className="flex gap-6">
      <BsFillChatLeftTextFill 
      className="text-panel-header-icon cursor-pointer text-xl"
      title="New Chat"
      onClick={handleAllContactsPage}
      />
      <>
      <BsThreeDotsVertical  
      className="text-panel-header-icon cursor-pointer text-xl"
      id="context-opener"
      title="Menu"
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
  </>
  );
}

export default ChatListHeader;

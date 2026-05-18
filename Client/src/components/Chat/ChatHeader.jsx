import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { saveDemoConversation } from "@/utils/DemoData";
import { useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoVideocam } from "react-icons/io5";
import { MdCall } from "react-icons/md";
import Avatar from "../common/Avatar";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const [{ currentChatUser, messagesSearch }, dispatch] = useStateProvider();
  const [activeCall, setActiveCall] = useState(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({x: 0, y: 0});
  const contactStatus = currentChatUser?.isTyping
    ? "digitando..."
    : currentChatUser?.isOnline
      ? "online"
      : currentChatUser?.lastSeen || "visto recentemente";

  const showContextMenu = (event) => {
    event.preventDefault();
    if (messagesSearch) {
      dispatch({type: reducerCases.SET_MESSAGE_SEARCH});
    }
    setContextMenuCordinates({x: event.pageX, y: event.pageY});
    setIsContextMenuVisible(true);
  };

  const clearConversation = () => {
    if (IS_DEMO_MODE && currentChatUser?.id) {
      saveDemoConversation(currentChatUser.id, []);
    }
    dispatch({type: reducerCases.SET_MESSAGES, messages: []});
  };

  const menuOptions = [
    {name: "Limpar conversa", callback: clearConversation},
  ];

  return (
  <>
  <div className="h-[76px] px-4 py-3 flex justify-between items-center bg-panel-header-background z-10 border-l border-conversation-border border-b border-conversation-border">
    <div className="flex items-center justify-center gap-4 min-w-0">
      <BiArrowBack
        className="md:hidden text-panel-header-icon cursor-pointer text-2xl"
        onClick={() => dispatch({type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: undefined})}
      />
      <div className="relative">
        <Avatar type="sm" image={currentChatUser?.profilePicture} />
        {currentChatUser?.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-icon-green border-2 border-panel-header-background" />}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-primary-strong font-semibold truncate">{currentChatUser?.name}</span>
        <span className={`text-sm truncate ${currentChatUser?.isTyping ? "text-icon-green" : "text-secondary"}`}>{contactStatus}</span>
      </div>
      {currentChatUser?.label && <span className="hidden md:inline-flex text-[10px] uppercase tracking-wide text-teal-light border border-teal-light/30 rounded-full px-2 py-0.5">{currentChatUser.label}</span>}
    </div>
    <div className="flex gap-6 min-w-fit">
      <MdCall  
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      title="Voice call"
      onClick={() => setActiveCall("voice")}
      />
      <IoVideocam
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      title="Video call"
      onClick={() => setActiveCall("video")}
      />
      <BiSearchAlt2
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      title="Search messages"
      onClick={() => dispatch({type:reducerCases.SET_MESSAGE_SEARCH})}
      />
      <BsThreeDotsVertical
      className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
      id="context-opener"
      title="Chat menu"
      onClick={showContextMenu}
      />
    </div>
  </div>
  {isContextMenuVisible && <ContextMenu
    options={menuOptions}
    cordinates={contextMenuCordinates}
    contextMenu={isContextMenuVisible}
    setContextMenu={setIsContextMenuVisible}
  />}
  {activeCall && (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center text-white">
      <div className="bg-panel-header-background rounded-2xl p-8 w-[360px] flex flex-col items-center gap-5 shadow-2xl">
        <Avatar type="xl" image={currentChatUser?.profilePicture} />
        <div className="text-center">
          <div className="text-2xl font-semibold">{currentChatUser?.name}</div>
          <div className="text-secondary mt-1">
            {activeCall === "voice" ? "Chamada de voz demo" : "Chamada de video demo"}
          </div>
          <div className="text-secondary text-sm mt-3">
            O backend de chamada ainda nao esta conectado nesta demo publica.
          </div>
        </div>
        <button
          className="bg-red-600 hover:bg-red-700 rounded-full px-6 py-3"
          onClick={() => setActiveCall(null)}
        >
          Encerrar
        </button>
      </div>
    </div>
  )}
  </>
  );
}

export default ChatHeader;

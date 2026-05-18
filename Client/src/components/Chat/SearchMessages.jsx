import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const [{currentChatUser, messages}, dispatch] = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState([]);


  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if(normalizedSearch) {
      const filteredMessages = messages.filter(
        message => message.type === "text" && message.message.toLowerCase().includes(normalizedSearch)
      );
      setSearchedMessages(filteredMessages);
    } else {
      setSearchedMessages([]);
    }
  }, [messages, searchTerm]);

  return (
  <div className="border-l border-conversation-border w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
    <div className="h-[76px] px-4 py-5 flex gap-6 items-center bg-panel-header-background text-primary-strong border-b border-conversation-border">
      <IoClose className="cursor-pointer text-icon-lighter text-2xl" 
      onClick={() => dispatch({type:reducerCases.SET_MESSAGE_SEARCH})}
      />
      <div>
        <div className="font-semibold">Pesquisar mensagens</div>
        <div className="text-secondary text-xs">{currentChatUser.name}</div>
      </div>
    </div>
    <div className="overflow-auto custom-scrollbar text-2xl h-full">
      <div className=" flex items-center flex-col w-full">
        <div className="flex px-5 items-center gap-3 h-16 w-full">
          <div className="bg-panel-header-background flex items-center gap-4 px-4 py-2 rounded-lg flex-grow">
            <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            <input type="text"
              placeholder="Pesquisar nesta conversa"
              className="bg-transparent text-sm focus:outline-none text-white w-full placeholder:text-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <span className="mt-8 text-secondary text-base px-8 text-center">
          {!searchTerm.length && `Pesquisar mensagens de ${currentChatUser.name}`}
        </span>
      </div>
      <div className="flex justify-center h-full flex-col">
        {
          searchTerm.length > 0 && !searchedMessages.length && (
          <span className="text-secondary w-full flex justify-center text-base mt-10">
            Mensagem não encontrada
          </span>
          )
        }
        <div 
        className="flex flex-col w-full h-full"
        >
          {
            searchedMessages.map((message) => (<div key={message.id} className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b border-conversation-border py-5">
              <div className="text-sm text-secondary">
                {calculateTime(message.createdAt)}
                </div>
              <div className="text-icon-green text-base mt-1 leading-relaxed">{message.message}</div>
            </div>))
          }
        </div>
      </div>
    </div>
  </div>);
}

export default SearchMessages;

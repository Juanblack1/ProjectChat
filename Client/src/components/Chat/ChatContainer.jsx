import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { calculateTime } from "@/utils/CalculateTime";
import { useI18n } from "@/utils/useI18n";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";


const VoiceMessage = dynamic(()=> import("./VoiceMessage"), {ssr: false});

function ChatContainer() {
  const [{messages, messagesLoading, currentChatUser, userInfo}] = useStateProvider();
  const { t, language } = useI18n();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, currentChatUser?.id]);

  return( 
  <div ref={containerRef} className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar bg-[#0b141a]">
    <div className="bg-chat-background h-full w-full opacity-[0.055] absolute inset-0 z-0 pointer-events-none"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-[#0b141a]/40 via-transparent to-[#0b141a]/70 z-0 pointer-events-none" />
      <div className="mx-5 md:mx-12 my-6 relative bottom-0 z-40 left-0 min-h-[calc(100%-3rem)] flex flex-col justify-end">
        <div className="mx-auto mb-5 rounded-lg bg-panel-header-background/95 text-secondary text-xs px-4 py-2 shadow-lg border border-conversation-border">
          {t("chat.today")}
        </div>
        <div className="mx-auto mb-6 rounded-lg bg-[#182229]/95 text-secondary text-xs px-4 py-3 max-w-[560px] text-center shadow-lg border border-conversation-border">
          {IS_DEMO_MODE
            ? t("chat.localNotice")
            : t("chat.realtimeNotice")}
        </div>
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-2 overflow-auto">
            {messagesLoading && (
              <div className="mx-auto text-center text-secondary bg-panel-header-background/80 rounded-xl px-6 py-5 border border-conversation-border max-w-[420px]">
                {t("chat.loadingMessages")}
              </div>
            )}
            {!messagesLoading && messages.length === 0 && (
              <div className="mx-auto text-center text-secondary bg-panel-header-background/80 rounded-xl px-6 py-5 border border-conversation-border max-w-[420px]">
                {t("chat.emptyConversation")}
              </div>
            )}
            {
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentChatUser.id ? "justify-start" : "justify-end"}`}
                >
                  {message.type === "text" && (
                    <div className={`text-white px-3 py-2 text-sm rounded-lg flex gap-3 items-end max-w-[78%] md:max-w-[56%] shadow-md ${message.senderId === currentChatUser.id ? "bg-incoming-background rounded-tl-sm" : "bg-outgoing-background rounded-tr-sm"}`}>
                      <span className="break-words whitespace-pre-wrap leading-relaxed">{message.message}</span>
                      <div className="flex gap-1 items-end min-w-fit">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {calculateTime(message.createdAt, language)}
                        </span>
                        <span>
                          {message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
                        </span>
                      </div>
                    </div>
                  )}
                  {message.type === "image" && <ImageMessage message={message} />}
                  {message.type === "audio" && <VoiceMessage message={message} />}
                </div>))
            }
          </div>
        </div>
      </div>
  </div>
  );
}

export default ChatContainer;

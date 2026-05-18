import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { getDemoConversationPreview } from "@/utils/DemoData";
import { formatPresence } from "@/utils/I18n";
import { useI18n } from "@/utils/useI18n";
import Avatar from "../common/Avatar";
import MessageStatus from "../common/MessageStatus";

function ChatLIstItem({data, isContactsPage = false}) {
  const[{currentChatUser}, dispatch] = useStateProvider()
  const { t, language } = useI18n();
  const isActive = currentChatUser?.id === data?.id;
  const preview = IS_DEMO_MODE ? getDemoConversationPreview(data, {
    audio: t("contacts.audio"),
    clearedConversation: t("contacts.clearedConversation"),
    photo: t("contacts.photo"),
  }) : {
    text: data?.type === "image" ? t("contacts.photo") : data?.type === "audio" ? t("contacts.audio") : data?.message,
    createdAt: data?.createdAt,
    messageStatus: data?.messageStatus,
    fromSelf: data?.senderId && data?.senderId !== data?.id,
  };
  const unreadCount = isActive ? 0 : (data?.unreadCount || data?.totalUnreadMessages || 0);
  const previewTime = preview.createdAt
    ? new Date(preview.createdAt).toLocaleTimeString(language === "en" ? "en-US" : "pt-BR", {hour: "2-digit", minute: "2-digit"})
    : "";
  const fallbackText = data?.isOnline ? t("presence.online") : data?.about || (data?.lastSeenAt ? formatPresence(data.lastSeenAt, language) : data?.lastSeen) || t("contacts.noMessages");

  const handleContactClick = () => {
    dispatch({type:reducerCases.CHANGE_CURRENT_CHAT_USER,user:{...data}})
    if (isContactsPage) {
      dispatch({type:reducerCases.SET_ALL_CONTACTS_PAGE})
    }
  }

  return( 
  <div 
    className={`flex cursor-pointer items-center transition-colors ${isActive ? "bg-background-default-hover" : "hover:bg-background-default-hover"}`}
    onClick={handleContactClick}
  >
    <div className="min-w-fit px-4 py-3 relative">
      <Avatar type="lg" image={data?.profilePicture} />
      {data?.isOnline && <span className="absolute bottom-4 right-4 h-3 w-3 rounded-full bg-icon-green border-2 border-search-input-container-background" />}
    </div>
    <div className="min-h-full flex flex-col justify-center pr-3 w-full border-b border-conversation-border py-3">
      <div className="flex justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-primary-strong truncate">{data?.name}</span>
          {data?.pinned && <span className="text-[10px] uppercase tracking-wide text-icon-green border border-icon-green/40 rounded-full px-1.5">{t("contacts.pinned")}</span>}
        </div>
        <span className={`text-xs min-w-fit ${unreadCount ? "text-icon-green" : "text-secondary"}`}>{previewTime}</span>
      </div>
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1 min-w-0">
          {preview.fromSelf && <MessageStatus messageStatus={preview.messageStatus} />}
          <span className={`line-clamp-1 text-sm ${unreadCount ? "text-primary-strong font-medium" : "text-secondary"}`}>
            {data?.isTyping ? t("presence.typing") : preview.text || fallbackText}
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-fit">
          {data?.muted && <span className="text-[10px] text-secondary">{t("contacts.muted")}</span>}
          {unreadCount > 0 && <span className="bg-icon-green text-search-input-container-background text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center font-bold">{unreadCount}</span>}
        </div>
      </div>
    </div>
  </div>
  );
}

export default ChatLIstItem;

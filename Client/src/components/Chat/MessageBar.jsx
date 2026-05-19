import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { addAiMessages, createAiAssistantMessage, createAiUserMessage, isAiContact, saveAiMessages, toAiApiMessages } from "@/utils/AiContact";
import { IS_DEMO_MODE } from "@/utils/AppConfig";
import { getAssistantUiRequestMetadata } from "@/utils/AssistantUiRuntime";
import { addDemoMessage, createDemoMessage, readFileAsDataUrl } from "@/utils/DemoData";
import { sendMessage as sendSupabaseMessage } from "@/utils/SupabaseChat";
import { useI18n } from "@/utils/useI18n";
import EmojiPicker from "emoji-picker-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import ImageCanvasEditor from "./ImageCanvasEditor";
import PhotoPicker from "../common/PhotoPicker";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"),{ssr:false});



function MessageBar() {
  const [{userInfo,currentChatUser,language}, dispatch] = useStateProvider();
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [sendingImage, setSendingImage] = useState(false);
  const [sendError, setSendError] = useState("");
  const [aiSending, setAiSending] = useState(false);
  const aiChat = isAiContact(currentChatUser);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if(event.target.id !== "emoji-open" ) {
        if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    }
  }, []);

  // useEffect(() => {
  //   const handleOutsideClickPhoto = (event) => {
  //     if(event.target.id !== "photo-picker" ) {
  //         setGrabPhoto(false)
  //     }
  //   }
  //   document,addEventListener("click", handleOutsideClickPhoto);
  //   return () => {
  //     document.removeEventListener("click", handleOutsideClickPhoto);
  //   }
  // }, []);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage+=emoji.emoji))
  };

  const addAiAssistantReply = (baseMessages, content, type = "text") => {
    const assistantMessage = createAiAssistantMessage({
      userId: userInfo?.id,
      type,
      message: content,
    });
    saveAiMessages(userInfo?.id, [...baseMessages, assistantMessage]);
    dispatch({ type: reducerCases.ADD_MESSAGE, newMessage: assistantMessage });
  };

  const sendMessage = async() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    setSendError("");

    try {
      if (aiChat) {
        const userMessage = createAiUserMessage({ userId: userInfo?.id, message: trimmedMessage });
        const nextMessages = addAiMessages(userInfo?.id, [userMessage], {welcome: t("contacts.aiWelcome")});
        dispatch({ type: reducerCases.ADD_MESSAGE, newMessage: userMessage });
        setMessage("");
        setAiSending(true);

        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assistantUi: getAssistantUiRequestMetadata(),
            language,
            messages: toAiApiMessages(nextMessages, userInfo?.id),
            prompt: trimmedMessage,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          addAiAssistantReply(nextMessages, data.error === "AI_NOT_CONFIGURED" ? t("chat.aiNotConfigured") : t("chat.aiError"));
          return;
        }
        addAiAssistantReply(
          nextMessages,
          data.type === "image" ? data.image : data.text,
          data.type === "image" ? "image" : "text"
        );
        return;
      }

      if (IS_DEMO_MODE) {
        const newMessage = createDemoMessage({
          contactId: currentChatUser.id,
          type: "text",
          message: trimmedMessage,
        });
        addDemoMessage(currentChatUser.id, newMessage);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
        });
        setMessage("")
        return;
      }

      const newMessage = await sendSupabaseMessage({
        from: userInfo?.id,
        to: currentChatUser?.id,
        message: trimmedMessage,
      });
      if (newMessage) {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
      }
      setMessage("")
    } catch {
      if (aiChat) {
        const currentAiMessages = addAiMessages(userInfo?.id, [], {welcome: t("contacts.aiWelcome")});
        addAiAssistantReply(currentAiMessages, t("chat.aiError"));
        return;
      }
      setSendError(t("chat.sendMessageError"));
    } finally {
      setAiSending(false);
    }
  };

  useEffect(()=> {
    if(grabPhoto) {
      const data = document.getElementById("photo-picker")
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)
      };
    };
  }, [grabPhoto]);

  const photoPickerChange = async (e) => {
    try{
      const file = e.target.files[0];
      if (!file) return;

      setSendError("");
      const imageUrl = await readFileAsDataUrl(file);
      setPendingImage(imageUrl);
      setGrabPhoto(false);
    } catch{
      setSendError(t("image.loadError"));
    }
  };

  const sendEditedImage = async (imageUrl) => {
    setSendingImage(true);
    setSendError("");
    try {
      if (IS_DEMO_MODE) {
        const newMessage = createDemoMessage({
          contactId: currentChatUser.id,
          type: "image",
          message: imageUrl,
        });
        addDemoMessage(currentChatUser.id, newMessage);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
        setPendingImage(null);
        return;
      }

      const newMessage = await sendSupabaseMessage({
        from: userInfo?.id,
        to: currentChatUser?.id,
        message: imageUrl,
        type: "image",
      });
      if(newMessage) {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage,
          fromSelf: true,
        });
      }
      setPendingImage(null);
    } catch{
      setSendError(t("chat.sendImageError"));
    } finally {
      setSendingImage(false);
    }
  };

  return( 
  <>
  <div className="bg-panel-header-background min-h-20 px-4 flex items-center gap-6 relative border-l border-conversation-border border-t border-conversation-border">
    {sendError && (
      <div className="absolute bottom-full left-4 mb-2 rounded-lg border border-red-500/20 bg-red-950/80 px-4 py-2 text-xs text-red-200 shadow-lg">
        {sendError}
      </div>
    )}
    {aiSending && !sendError && (
      <div className="absolute bottom-full left-4 mb-2 rounded-lg border border-icon-green/20 bg-[#182229]/95 px-4 py-2 text-xs text-teal-light shadow-lg">
        {t("chat.aiThinking")}
      </div>
    )}
    {
      !showAudioRecorder && (
    <>
        <div className="flex gap-6">
      <button type="button" className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong" title="Emoji" id="emoji-open" onClick={handleEmojiModal}>
        <BsEmojiSmile />
      </button>
      {
        showEmojiPicker && 
      <div className="absolute bottom-24 left-16 z-40"
      ref={emojiPickerRef}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
      </div>
      }
      {!aiChat && (
        <ImAttachment
        className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
        title={t("chat.attachFile")}
        onClick={() => {
          setGrabPhoto (true)
        }}
        />
      )}
    </div>
    <div className="w-full rounded-lg h-11 flex items-center">
      <input
      type="text"
        placeholder={aiChat ? t("chat.aiPlaceholder") : t("chat.messagePlaceholder")}
      className="bg-input-background text-sm focus:outline-none focus:ring-1 focus:ring-icon-green/60 text-white h-11 rounded-lg px-5 py-4 w-full placeholder:text-secondary"
      onChange={e => setMessage(e.target.value)}
      disabled={aiSending}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      }}
      value={message}
      />
    </div>
    <div className="flex w-10 items-center justify-center">
      <button
        type="button"
        className="h-10 w-10 rounded-full hover:bg-background-default-hover flex items-center justify-center disabled:opacity-50"
        disabled={aiSending || (!message.length && aiChat)}
        onClick={message.length ? sendMessage : (!aiChat ? () => setShowAudioRecorder(true) : undefined)}
      >
      {
        message.length? (
          <MdSend 
          className="text-icon-green cursor-pointer text-2xl"
          title={t("common.send")}
          />):(!aiChat && (
          <FaMicrophone
          className="text-panel-header-icon cursor-pointer text-xl hover:text-primary-strong"
          title={t("chat.record")}
          />
      ))}
      </button>
    </div>
    </>
  )
}
    {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    {
      showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />
    }
  </div>
    {pendingImage && (
      <ImageCanvasEditor
        imageSrc={pendingImage}
        title={t("chat.prepareImage")}
        confirmLabel={t("chat.sendImage")}
        busy={sendingImage}
        defaultDrawMode={true}
        onClose={() => setPendingImage(null)}
        onConfirm={sendEditedImage}
      />
    )}
  </>
  );
}

export default MessageBar;

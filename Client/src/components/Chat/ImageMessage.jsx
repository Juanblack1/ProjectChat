import { useStateProvider } from "@/context/StateContext";
import { getAssetUrl } from "@/utils/AssetUrl";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageCanvasEditor from "./ImageCanvasEditor";

function ImageMessage({ message }) {
  const [{currentChatUser, userInfo}] =  useStateProvider();
  const imageUrl = getAssetUrl(message.message);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [localImage, setLocalImage] = useState("");
  const annotationKey = useMemo(() => (
    userInfo?.id && message.id ? `projectchat:image-annotation:${userInfo.id}:${message.id}` : ""
  ), [message.id, userInfo?.id]);
  const displayUrl = localImage || imageUrl;

  useEffect(() => {
    if (!annotationKey || typeof window === "undefined") return;
    setLocalImage(window.localStorage.getItem(annotationKey) || "");
  }, [annotationKey]);

  const saveLocalAnnotation = (imageDataUrl) => {
    if (!annotationKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(annotationKey, imageDataUrl);
      setLocalImage(imageDataUrl);
      setViewerOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const resetLocalAnnotation = () => {
    if (!annotationKey || typeof window === "undefined") return;
    window.localStorage.removeItem(annotationKey);
    setLocalImage("");
  };

  return( 
  <>
  <div className={`p-1.5 rounded-lg shadow-md ${message.senderId === currentChatUser.id ? "bg-incoming-background rounded-tl-sm": "bg-outgoing-background rounded-tr-sm"}`}>
    <button type="button" className="relative block text-left" onClick={() => setViewerOpen(true)}>
      <Image src={displayUrl}
        className="rounded-lg object-cover max-h-[320px] max-w-[320px]"
        alt="Imagem enviada"
        height={300}
        width={300}
        unoptimized={displayUrl.startsWith("data:") || displayUrl.startsWith("blob:")}
        />
      <div className="absolute bottom-1 right-1 flex items-end gap-1">
      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
        {
          calculateTime(message.createdAt)
        }
      </span>
      <span className="text-bubble-meta">
        {
          message.senderId === userInfo.id && (
            <MessageStatus messageStatus={message.messageStatus} />
          )
        }
      </span>
      </div>
    </button>
  </div>
    {viewerOpen && (
      <ImageCanvasEditor
        imageSrc={imageUrl}
        initialImageSrc={displayUrl}
        title="Visualizar imagem"
        confirmLabel="Salvar rabisco"
        defaultDrawMode={false}
        onClose={() => setViewerOpen(false)}
        onConfirm={saveLocalAnnotation}
        onReset={resetLocalAnnotation}
      />
    )}
  </>
  );
}

export default ImageMessage;

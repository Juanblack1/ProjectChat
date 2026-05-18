import { useStateProvider } from "@/context/StateContext";
import { getAssetUrl } from "@/utils/AssetUrl";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  const [{currentChatUser, userInfo}] =  useStateProvider();
  const imageUrl = getAssetUrl(message.message);

  return( 
  <div className={`p-1.5 rounded-lg shadow-md ${message.senderId === currentChatUser.id ? "bg-incoming-background rounded-tl-sm": "bg-outgoing-background rounded-tr-sm"}`}>
    <div className="relative">
      <Image src={imageUrl}
      className="rounded-lg object-cover max-h-[320px] max-w-[320px]"
      alt="asset"
      height={300}
      width={300}
      unoptimized={imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")}
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
    </div>
  </div>
  );
}

export default ImageMessage;

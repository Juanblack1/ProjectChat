import Image from "next/image";
import { useI18n } from "@/utils/useI18n";

function LoadingScreen({ message }) {
  const { t } = useI18n();
  return (
    <div className="h-screen w-screen bg-[#0b141a] text-primary-strong flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-chat-background opacity-[0.035]" />
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-conversation-border bg-panel-header-background/95 px-8 py-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-icon-green/15 flex items-center justify-center">
          <Image src="/whatsapp.gif" alt="ProjectChat" width={44} height={44} />
        </div>
        <h1 className="text-2xl font-semibold mb-2">ProjectChat</h1>
        <p className="text-secondary text-sm leading-relaxed">{message || t("common.loading")}</p>
        <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-search-input-container-background">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-icon-green" />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;

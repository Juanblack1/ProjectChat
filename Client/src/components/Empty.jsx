import Image from "next/image";
import { BsCheck2All, BsLockFill, BsPhone } from "react-icons/bs";
import { useI18n } from "@/utils/useI18n";

function Empty() {
  const { t } = useI18n();
  return (
    <div className="border-l border-conversation-border w-full bg-[#111b21] flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-chat-background opacity-[0.035]" />
      <div className="absolute h-[420px] w-[420px] rounded-full bg-icon-green/10 blur-3xl top-16 right-24" />
      <div className="absolute h-[320px] w-[320px] rounded-full bg-teal-light/10 blur-3xl bottom-8 left-16" />
      <div className="relative z-10 flex flex-col items-center text-center max-w-[720px] px-8">
        <div className="rounded-full bg-panel-header-background/80 p-6 border border-conversation-border shadow-2xl mb-8">
          <Image src="/whatsapp.gif" alt="ProjectChat" height={220} width={220} priority />
        </div>
        <h1 className="text-primary-strong text-4xl font-light mb-3">{t("common.projectChatWeb")}</h1>
        <p className="text-secondary text-base leading-relaxed max-w-[560px]">
          {t("empty.description")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 w-full">
          <div className="bg-panel-header-background/85 border border-conversation-border rounded-xl px-4 py-4 text-left">
            <BsLockFill className="text-icon-green mb-3" />
            <div className="text-primary-strong text-sm font-semibold">{t("empty.secureTitle")}</div>
            <div className="text-secondary text-xs mt-1">{t("empty.secureText")}</div>
          </div>
          <div className="bg-panel-header-background/85 border border-conversation-border rounded-xl px-4 py-4 text-left">
            <BsCheck2All className="text-icon-ack mb-3 text-lg" />
            <div className="text-primary-strong text-sm font-semibold">{t("empty.flowsTitle")}</div>
            <div className="text-secondary text-xs mt-1">{t("empty.flowsText")}</div>
          </div>
          <div className="bg-panel-header-background/85 border border-conversation-border rounded-xl px-4 py-4 text-left">
            <BsPhone className="text-teal-light mb-3" />
            <div className="text-primary-strong text-sm font-semibold">{t("empty.contactsTitle")}</div>
            <div className="text-secondary text-xs mt-1">{t("empty.contactsText")}</div>
          </div>
        </div>
        <div className="text-secondary text-xs mt-8">{t("empty.footer")}</div>
      </div>
    </div>
  );
}

export default Empty;

import { LANGUAGES } from "@/utils/I18n";
import { useI18n } from "@/utils/useI18n";

function LanguageSelector({ compact = false }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className={`flex items-center gap-2 text-secondary ${compact ? "text-xs" : "text-sm"}`}>
      {!compact && <span>{t("common.language")}</span>}
      <select
        className="bg-search-input-container-background border border-conversation-border rounded-lg px-2 py-1 text-primary-strong focus:outline-none focus:ring-1 focus:ring-icon-green/60"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        aria-label={t("common.language")}
      >
        {LANGUAGES.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSelector;

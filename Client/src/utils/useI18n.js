import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { normalizeLanguage, saveStoredLanguage, translate } from "./I18n";

export const useI18n = () => {
  const [{ language }, dispatch] = useStateProvider();
  const currentLanguage = normalizeLanguage(language);

  const setLanguage = (nextLanguage) => {
    const normalized = normalizeLanguage(nextLanguage);
    saveStoredLanguage(normalized);
    dispatch({ type: reducerCases.SET_LANGUAGE, language: normalized });
  };

  return {
    language: currentLanguage,
    setLanguage,
    t: (key, params) => translate(key, currentLanguage, params),
  };
};

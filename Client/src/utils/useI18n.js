import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { useCallback } from "react";
import { normalizeLanguage, saveStoredLanguage, translate } from "./I18n";

export const useI18n = () => {
  const [{ language }, dispatch] = useStateProvider();
  const currentLanguage = normalizeLanguage(language);

  const setLanguage = useCallback((nextLanguage) => {
    const normalized = normalizeLanguage(nextLanguage);
    saveStoredLanguage(normalized);
    dispatch({ type: reducerCases.SET_LANGUAGE, language: normalized });
  }, [dispatch]);

  const t = useCallback((key, params) => translate(key, currentLanguage, params), [currentLanguage]);

  return {
    language: currentLanguage,
    setLanguage,
    t,
  };
};

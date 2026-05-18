import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { getStoredLanguage } from "@/utils/I18n";
import { useEffect } from "react";

function LanguageBootstrap() {
  const [, dispatch] = useStateProvider();

  useEffect(() => {
    dispatch({ type: reducerCases.SET_LANGUAGE, language: getStoredLanguage() });
  }, [dispatch]);

  return null;
}

export default LanguageBootstrap;

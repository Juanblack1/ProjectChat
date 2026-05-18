import { DEFAULT_LANGUAGE, normalizeLanguage, translate } from "./I18n";

const localeForLanguage = (language) => (normalizeLanguage(language) === "en" ? "en-US" : "pt-BR");

const isSameLocalDay = (left, right) => (
  left.getDate() === right.getDate() &&
  left.getMonth() === right.getMonth() &&
  left.getFullYear() === right.getFullYear()
);

export const calculateTime = (inputDateStr, language = DEFAULT_LANGUAGE) => {
  const inputDate = new Date(inputDateStr);
  if (Number.isNaN(inputDate.getTime())) return "";

  const currentDate = new Date();
  const locale = localeForLanguage(language);

  const timeFormat = { hour: "2-digit", minute: "2-digit" };
  const dateFormat = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  };

  if (isSameLocalDay(inputDate, currentDate)) {
    return inputDate.toLocaleTimeString(locale, timeFormat);
  }

  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  if (isSameLocalDay(inputDate, yesterday)) {
    return translate("date.yesterday", language);
  }

  const elapsedDays = Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24));
  if (elapsedDays > 1 && elapsedDays <= 7) {
    const weekday = inputDate.toLocaleDateString(locale, { weekday: "long" });
    const shortDate = inputDate.toLocaleDateString(locale, { day: "2-digit", month: "short" });
    return `${weekday}, ${shortDate}`;
  }

  return inputDate.toLocaleDateString(locale, dateFormat);
};

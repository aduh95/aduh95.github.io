import supportedLanguages, { SupportedLanguage } from "./SupportedLanguages.js";

const htmlElement = window.document.documentElement;

const extractLocale = (locale: string) => {
  const localeLang = locale.substr(0, 2) as SupportedLanguage;

  if (supportedLanguages.includes(localeLang)) {
    const countryCode = locale.split("-")[1];
    locale = localeLang;
    if (countryCode) {
      locale += "-" + countryCode;
    }
  } else {
    locale = "en-" + (locale.split("-")[1] || "US");
  }

  return locale;
};

const changeLanguage = function () {
  const { locale, lang } = getCurrentLocale();
  const progressElem = document.querySelectorAll("time");

  htmlElement.setAttribute("lang", lang);

  for (const elem of progressElem) {
    const dateTime = elem.dateTime || elem.getAttribute("datetime") || "";
    elem.innerText = new Date(dateTime).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  }
};

if (!location.hash) {
  const { navigator } = window;
  location.hash = extractLocale(
    navigator.userLanguage ||
      ("languages" in navigator && navigator.languages[0]) ||
      navigator.language ||
      htmlElement.getAttribute("lang") ||
      ""
  );
}

window.addEventListener("hashchange", changeLanguage);

document.addEventListener("DOMContentLoaded", changeLanguage, false);

export default function getCurrentLocale() {
  const locale = extractLocale(location.hash.replace(/^#/, ""));
  return { locale, lang: locale.substr(0, 2) as SupportedLanguage };
}

declare global {
  interface NavigatorLanguage {
    userLanguage?: string;
  }
}

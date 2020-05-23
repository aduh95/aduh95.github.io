import { flags } from "./SupportedLanguages.js";

const footer = document.querySelector("body>footer");

footer!.append(
  " – ",
  ...Object.entries(flags).map(([lang, flag]) => {
    const link = document.createElement("a");
    link.href = "#" + lang;
    link.append(flag);
    return link;
  })
);

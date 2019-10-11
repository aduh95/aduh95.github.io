import languages from "../data/languages.json";

import { h } from "@aduh95/async-jsx";

import "./languages.scss";

export default function Languages() {
  return (
    <section className="languages meter-section">
      {Object.values(languages).map(section => (
        <article>
          {Object.entries(section.name).map(([lang, text]) => (
            <h5 lang={lang}>{text}</h5>
          ))}
          <meter value={section.level} title={section.levelTitle || ""} />
          {Object.entries(section.description).map(([lang, text]) => (
            <span lang={lang}>{text}</span>
          ))}
        </article>
      ))}
    </section>
  );
}

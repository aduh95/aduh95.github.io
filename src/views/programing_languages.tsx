import languages from "../data/programming_languages.json";

import { h } from "@aduh95/async-jsx";

import "./languages.scss";

export default function ProgramingLanguages() {
  return (
    <section className="programming_languages meter-section">
      {languages.map(section => (
        <article>
          {Object.entries(section.name).map(([lang, text]) => (
            <h5 lang={lang}>{text}</h5>
          ))}
          <meter
            value={section.level}
            title={Number(section.level) * 100 + "%" || ""}
          />
        </article>
      ))}
    </section>
  );
}

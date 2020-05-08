import languages from "../data/programming_languages.json";

import { h } from "@aduh95/async-jsx";

import "./languages.scss";

export default function ProgrammingLanguages() {
  return (
    <section className="programming_languages meter-section">
      <h3 lang="en">Programming Languages</h3>
      <h3 lang="fr">Programmation informatique</h3>
      {languages
        .sort((el1, el2) =>
          el1.level > el2.level ? -1 : el1.level < el2.level ? 1 : 0
        )
        .map((section) => (
          <article>
            <h5>{section.name}</h5>
            <meter
              value={section.level}
              title={Number(section.level) * 100 + "%" || ""}
            />
          </article>
        ))}
    </section>
  );
}

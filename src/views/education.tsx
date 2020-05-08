import education from "../data/education.json";

import { h } from "@aduh95/async-jsx";
import { FontAwesomeIcon } from "@aduh95/jsx-fontawesome";

import {
  faMapMarker,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { SupportedLanguage } from "../runtime/SupportedLanguages.js";

export default function Education() {
  return (
    <section className="education">
      <h3 lang="en">Education</h3>
      <h3 lang="fr">Formation</h3>
      {education.map((section) => (
        <article>
          {Object.entries(section.name).map(([lang, text]) => (
            <h5 lang={lang}>{text}</h5>
          ))}
          {Object.entries(section.description).map(
            ([lang, text]) =>
              text && <h6 lang={lang as SupportedLanguage}>{text}</h6>
          )}
          <ul>
            <li className="date">
              <FontAwesomeIcon icon={faGraduationCap} />
              {section.graduation}
            </li>
            <li className="place">
              <FontAwesomeIcon icon={faMapMarker} />
              {section.place}
            </li>
          </ul>
        </article>
      ))}
    </section>
  );
}

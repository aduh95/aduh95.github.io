import education from "../data/education.json";

import { h } from "@aduh95/async-jsx";
import { FontAwesomeIcon } from "@aduh95/jsx-fontawesome";

import { faCalendar, faMapMarker } from "@fortawesome/free-solid-svg-icons";

export default function Education() {
  return (
    <section className="education">
      <h3 lang="en">Education</h3>
      <h3 lang="fr">Formation</h3>
      {education.map(section => (
        <article>
          {Object.entries(section.name).map(([lang, text]) => (
            <h5 lang={lang}>{text}</h5>
          ))}
          <ul>
            <li className="date">
              <FontAwesomeIcon icon={faCalendar} />
              {section.date || `${section.begin} - ${section.end}`}
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

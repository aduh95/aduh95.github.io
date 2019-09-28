import { h } from "@aduh95/async-jsx";
import { FontAwesomeIcon } from "@aduh95/jsx-fontawesome";
import { IconLookup } from "@fortawesome/fontawesome-common-types";

import personal_information from "../data/personal_information.js";
import about from "../data/about.json";
import skills from "../data/skills.json";
import hobbies from "../data/hobbies.json";

import { AUTHOR_NAME } from "../config.json";

import "./aside.scss";

export default function Aside() {
  return (
    <aside>
      <header>
        <h3>
          <img src="./test.jpg" alt={AUTHOR_NAME} width="280" height="360" />
        </h3>
        <ul className="personal_information">
          {Object.entries(personal_information).map(
            ([className, { icon, href, text }]) => (
              <li className={className}>
                <FontAwesomeIcon icon={icon as IconLookup} />
                <a href={href} target="_blank" rel="noopener">
                  {text}
                </a>
              </li>
            )
          )}
        </ul>
      </header>
      <section className="about">
        <h3 lang="en">About me</h3>
        <h3 lang="fr">À propos de moi</h3>
        {Object.entries(about).map(([lang, text]) => (
          <p lang={lang}>{text}</p>
        ))}
      </section>
      <section className="skills">
        <h3 lang="en">Skills</h3>
        <h3 lang="fr">Points forts</h3>
        <ul>
          {Array.from(skills).map(({ icon, name }) => (
            <li>
              <FontAwesomeIcon icon={icon as "text"} />
              {Object.entries(name).map(([lang, text]) => (
                <span lang={lang}>{text}</span>
              ))}
            </li>
          ))}
        </ul>
      </section>
      <section className="hobbies">
        <h3 lang="en">Hobbies</h3>
        <h3 lang="fr">Loisirs</h3>
        {Array.from(hobbies).map(({ icon, name }) => (
          <li>
            <FontAwesomeIcon icon={icon as "text"} />
            {Object.entries(name).map(([lang, text]) => (
              <span lang={lang}>{text}</span>
            ))}
          </li>
        ))}
      </section>
    </aside>
  );
}

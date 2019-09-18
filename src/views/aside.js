import personal_information from "../../front/json/personal_information.json";
import about from "../../front/json/about.json";
import skills from "../../front/json/skills.json";
import hobbies from "../../front/json/hobbies.json";
import { h } from "@aduh95/async-jsx";
import FontAwesomeIcon from "@aduh95/jsx-fontawesome";

import { AUTHOR_NAME } from "./config.js";

export default function Aside() {
  return (
    <aside>
      <header>
        <h3>
          <img src="./test.jpg" alt={AUTHOR_NAME} width="280" height="360" />
        </h3>
        <ul class="personal_information">
          {Object.entries(personal_information).map(
            ([className, { icon, href, text }]) => (
              <li className={className}>
                <FontAwesomeIcon icon={icon} />
                <a href={href} target="_blank" rel="noopener">
                  {text}
                </a>
              </li>
            )
          )}
        </ul>
      </header>
      <section class="about">
        <h3 lang="en">About me</h3>
        <h3 lang="fr">À propos de moi</h3>
        {Object.entries(about).map(([lang, text]) => (
          <p lang={lang}>{text}</p>
        ))}
      </section>
      <section class="skills">
        <h3 lang="en">Skills</h3>
        <h3 lang="fr">Points forts</h3>
        <ul>
          {Array.from(skills).map(({ icon, name }) => (
            <li>
              <FontAwesomeIcon icon={icon} />
              {Object.entries(name).map(([lang, text]) => (
                <span lang={lang}>{text}</span>
              ))}
            </li>
          ))}
        </ul>
      </section>
      <section class="hobbies">
        <h3 lang="en">Hobbies</h3>
        <h3 lang="fr">Loisirs</h3>
        {Array.from(hobbies).map(({ icon, name }) => (
          <li>
            <FontAwesomeIcon icon={icon} />
            {Object.entries(name).map(([lang, text]) => (
              <span lang={lang}>{text}</span>
            ))}
          </li>
        ))}
      </section>
    </aside>
  );
}

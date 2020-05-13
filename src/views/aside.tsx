import { h } from "@aduh95/async-jsx";
import { FontAwesomeIcon } from "@aduh95/jsx-fontawesome";

import personal_information from "../data/personal_information.js";
import about from "../data/about.toml";
import skills from "../data/skills.js";
import hobbies from "../data/hobbies.js";

import { AUTHOR_NAME } from "../data/header.toml";

import "./aside.scss";

export default function Aside() {
  return (
    <aside>
      <header>
        <img
          src="./antoineduhamel.jpg"
          alt={AUTHOR_NAME}
          width="280"
          height="360"
        />

        <ul className="personal_information">
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
              <FontAwesomeIcon icon={icon} />
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
        <ul>
          {Array.from(hobbies).map(({ icon, name }) => (
            <li>
              <FontAwesomeIcon icon={icon} />
              {Object.entries(name).map(([lang, text]) => (
                <span lang={lang}>{text}</span>
              ))}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

import { h } from "@aduh95/async-jsx";

import experience from "../data/experience.toml";
import { FontAwesomeIcon } from "@aduh95/jsx-fontawesome";

import { SupportedLanguage } from "../runtime/SupportedLanguages";

import "./experience.scss";

import {
  faThumbtack,
  faCalendar,
  faMapMarker,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

const MORE_INFO = {
  en: "More information",
  fr: "En savoir plus",
};

const ICONS = {
  date: faCalendar,
  place: faMapMarker,
  website: faGlobe,
};

const SECONDS_IN_A_MONTH = 60 * 60 * 24 * 30;

type ExperienceInfoProps =
  | {
      type: "date";
      value: { begin: string; end?: string };
    }
  | { type: "place" | "website"; value: { link: string; text: string } };

const ExperienceInfo = (props: ExperienceInfoProps) => {
  let $value = props.value;
  const icon = <FontAwesomeIcon icon={ICONS[props.type]} />;
  switch (props.type) {
    case "date":
      const { begin, end } = $value as { begin: string; end?: string };
      const $begin = new Date(begin);
      const $hasEnded = end && Date.parse(end) < Date.now();
      const $end = $hasEnded ? new Date(end as string) : (null as never);
      if (
        !$hasEnded ||
        ($end as any) - ($begin as any) > SECONDS_IN_A_MONTH * 1000
      ) {
        return (
          <li>
            {icon}
            <span lang="en">
              {$hasEnded ? "From " : "Since "}
              <time dateTime={$begin.toISOString()}>
                {$begin.toDateString()}
              </time>
              {$hasEnded
                ? [
                    " to ",
                    <time dateTime={$end.toISOString()}>
                      {$end.toDateString()}
                    </time>,
                  ]
                : null}
            </span>
            <span lang="fr">
              {$hasEnded ? "De " : "Depuis "}
              <time dateTime={$begin.toISOString()}>
                {$begin.toLocaleDateString("fr")}
              </time>
              {$hasEnded
                ? [
                    " à ",
                    <time dateTime={$end.toISOString()}>
                      {$end.toLocaleDateString("fr")}
                    </time>,
                  ]
                : null}
            </span>
          </li>
        );
      } else {
        // If the current experience did not last more than a month
        return (
          <li>
            {icon}
            <span lang="en">
              <time dateTime={$begin.toISOString()}>{$begin}</time>
            </span>
            <span lang="fr">
              <time dateTime={$begin.toISOString()}>{$begin}</time>
            </span>
          </li>
        );
      }

    case "website":
    // non breaking to add the list item
    case "place":
      const { link, text } = $value as { link: string; text: string };
      return (
        <li>
          {icon}
          <a href={link} target="_blank" rel="noopener">
            {text}
          </a>
        </li>
      );

    default:
      throw new Error("Invalid value for type prop");
  }
};

export default function Experience() {
  return (
    <section className="experience">
      <h3 lang="en">Experience</h3>
      <h3 lang="fr">Expérience professionnelle</h3>
      {experience.map(
        ({
          name,
          mission,
          info = {},
          description = null,
          technologies = null,
          keywords = {},
        }) => (
          <article>
            <h5>{name}</h5>
            {Object.entries(mission).map(([lang, text]) => (
              <h6 lang={lang as SupportedLanguage} className="mission">
                {text}
              </h6>
            ))}
            <ul>
              {Object.entries(info).map(([type, value]) => (
                <ExperienceInfo type={type as any} value={value as any} />
              ))}
            </ul>

            {description === null ? null : (
              <details>
                <summary tabindex={0}>
                  <FontAwesomeIcon icon={faThumbtack} />
                  {Object.keys(description).map((lang) => (
                    <span lang={lang}>
                      {lang in keywords
                        ? keywords[lang].join(" · ")
                        : MORE_INFO[lang as SupportedLanguage]}
                    </span>
                  ))}
                </summary>
                {Object.entries(description).map(([lang, text]) => (
                  <p lang={lang} className="mission">
                    {text}
                  </p>
                ))}
              </details>
            )}

            {Array.isArray(technologies) ? (
              <ul>
                {technologies.map(({ icon, name }) => (
                  <li>
                    <FontAwesomeIcon icon={icon} />
                    {name}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        )
      )}
    </section>
  );
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    tabindex?: number;
  }
}

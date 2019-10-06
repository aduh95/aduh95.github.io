import { h } from "@aduh95/async-jsx";

import experience from "../data/experience.json";
import { FontAwesomeIcon } from "@aduh95/jsx-fontawesome";

import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

const MORE_INFO = {
  en: "More information",
  fr: "En savoir plus",
};

const ICONS = {
  date: "calendar",
  place: "map-marker",
  website: "globe",
};

const SECONDS_IN_A_MONTH = 60 * 60 * 24 * 30;

type ExperienceInfoProps =
  | {
      type: "date";
      value: { begin: string; end: string };
    }
  | { type: "website" | "place"; value: string };

const ExperienceInfo = (props: ExperienceInfoProps) => {
  let $value: any = props.value;
  switch (props.type) {
    case "date":
      const { begin, end } = $value as { begin: string; end: string };
      const $begin = new Date(begin);
      const $hasEnded = !Boolean(end);
      const $end = $hasEnded ? new Date(end) : (null as never);
      if (
        !$hasEnded ||
        ($end as any) - ($begin as any) < SECONDS_IN_A_MONTH * 1000
      ) {
        return (
          <li>
            <span lang="en">
              {$hasEnded ? "From " : "Since "}
              <time dateTime={$begin.toISOString()}>{$begin}</time>
              {$hasEnded
                ? [" to ", <time dateTime={$end.toISOString()}>{$end}</time>]
                : null}
            </span>
            <span lang="fr">
              {$hasEnded ? "De " : "Depuis "}
              <time dateTime={$begin.toISOString()}>{$begin}</time>
              {$hasEnded
                ? [" à ", <time dateTime={$end.toISOString()}>{$end}</time>]
                : null}
            </span>
          </li>
        );
      } else {
        // If the current experience did not last more than a month
        return (
          <li>
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
      $value = {
        link: $value as string,
        text: ($value as string).replace(/^https?:\/\/(www\.)?/, ""),
      };

    // non breaking to add the list item
    case "place":
      return (
        <li>
          <a href={$value.link} target="_blank" rel="noopener">
            {$value.text}
          </a>
        </li>
      );

    default:
      throw new Error("Invalid value for type prop");
  }
};

export default function Experience() {
  return (
    <section>
      {Object.entries(experience).map(
        ([
          name,
          {
            mission,
            info = {},
            description = null,
            technologies = null,
            keywords = {},
          },
        ]) => (
          <article>
            <h5>{name}</h5>
            {Object.entries(mission).map(([lang, text]) => [
              <h6 lang={lang} className="mission">
                {text}
              </h6>,
              <ul>
                {Object.entries(info).map(([type, value]) => (
                  <ExperienceInfo type={type as any} value={value} />
                ))}
              </ul>,

              description === null ? null : (
                <details>
                  <summary>
                    <FontAwesomeIcon icon={faThumbtack} />
                    {Object.keys(description).map(lang => (
                      <span lang={lang}>
                        {lang in keywords
                          ? (keywords as any)[lang].join(" · ")
                          : MORE_INFO[lang as ("fr" | "en")]}
                      </span>
                    ))}
                  </summary>
                  {Object.entries(description).map(([lang, text]) => (
                    <p lang={lang} className="mission">
                      {text}
                    </p>
                  ))}
                </details>
              ),

              Array.isArray(technologies) ? (
                <ul>
                  {technologies.map(({ icon, name }) => (
                    <li>
                      {/* <FontAwesomeIcon icon={icon} /> */}
                      {name}
                    </li>
                  ))}
                </ul>
              ) : null,
            ])}
          </article>
        )
      )}
    </section>
  );
}

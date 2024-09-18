import { h } from "@aduh95/async-jsx";

import experience from "../data/experience.toml";
import { FontAwesomeIcon } from "@aduh95/jsx-fontawesome";

import { SupportedLanguage } from "../runtime/SupportedLanguages";

import "./experience.scss";

import {
  faCalendar,
  faMapMarker,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const MORE_INFO = {
  en: "More information",
  fr: "En savoir plus",
};

const ICONS = {
  date: faCalendar,
  github: faGithub,
  place: faMapMarker,
  website: faGlobe,
};

const SECONDS_IN_A_MONTH = 60 * 60 * 24 * 30;

type ExperienceInfoProps =
  | {
      type: "date";
      value: { begin: string; end?: string };
    }
  | {
      type: "place" | "website" | "github";
      value: { link: string; text: string };
    };

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
          <tr>
            <td>{icon}</td>
            <td colSpan={3}>
              <span lang="en">
                {$hasEnded ? "Between " : "Since "}
                <time dateTime={$begin.toISOString()}>
                  {$begin.toDateString()}
                </time>
                {$hasEnded
                  ? [
                      " and ",
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
            </td>
          </tr>
        );
      } else {
        // If the current experience did not last more than a month
        return (
          <tr>
            <td>{icon}</td>
            <td colSpan={3}>
              <span lang="en">
                <time dateTime={$begin.toISOString()}>{$begin}</time>
              </span>
              <span lang="fr">
                <time dateTime={$begin.toISOString()}>{$begin}</time>
              </span>
            </td>
          </tr>
        );
      }

    case "github":
      (
        $value as { link: string; text: string }
      ).link = `https://github.com/${$value.text}`;
    // non breaking to add the list item
    case "place":
    case "website":
      const { link, text } = $value as { link: string; text: string };
      return (
        <tr>
          <td>{icon}</td>
          <td colSpan={3}>
            <a href={link} target="_blank" rel="noopener">
              {text}
            </a>
          </td>
        </tr>
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
      {experience.map(({ name, description = null, info = {}, item }) => (
        <article>
          <h5>{name}</h5>
          {description === null
            ? null
            : Object.entries(description).map(
                ([lang, text]) =>
                  text && <h6 lang={lang as SupportedLanguage}>{text}</h6>
              )}

          <table>
            <colgroup>
              <col />
              <col width={160} />
              <col width={120} />
              <col width={120} />
            </colgroup>
            <tbody>
              {Object.entries(info).map(([type, value]) => (
                <ExperienceInfo type={type as any} value={value as any} />
              ))}

              <tr>
                <td>&nbsp;</td>
              </tr>

              {item.map(
                ({ name, icon, title, repo = null, website = null }) => (
                  <tr>
                    <td>
                      <FontAwesomeIcon icon={icon} />
                    </td>
                    <td colSpan={repo === null ? 2 : undefined}>
                      {name} (
                      {Object.keys(title).map((lang) => (
                        <span lang={lang}>
                          {lang in title
                            ? title[lang]
                            : MORE_INFO[lang as SupportedLanguage]}
                        </span>
                      ))}
                      )
                    </td>
                    {repo ? (
                      <td>
                        <FontAwesomeIcon icon={faGithub} />
                        &nbsp;
                        <a
                          href={`https://github.com/${repo}/commits?author=aduh95`}
                          target="_blank"
                          rel="noopener"
                        >
                          {repo}
                        </a>
                      </td>
                    ) : null}
                    {website ? (
                      <td>
                        <FontAwesomeIcon icon={faGlobe} />
                        &nbsp;
                        <a
                          href={`https://${website}`}
                          target="_blank"
                          rel="noopener"
                        >
                          {website}
                        </a>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </article>
      ))}
    </section>
  );
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    tabindex?: number;
  }
}

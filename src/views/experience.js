// use const aduh95\Resume\CONFIG\EXPERIENCE\ICONS;
// use const aduh95\Resume\CONFIG\EXPERIENCE\DATE_FORMAT;
import experience from "../../front/json/experience.json";
import FontAwesomeIcon from "@aduh95/jsx-fontawesome";

const MORE_INFO = {
  en: "More information",
  fr: "En savoir plus",
};

const SECONDS_IN_A_MONTH = 60 * 60 * 24 * 30;

class ExperienceInfo extends Component {
  render() {
    let $value = this.props.value;
    switch (this.props.type) {
      case "date":
        const $begin = new Date($value["begin"]);
        const $hasEnded = !Boolean($value["end"]);
        const $end = $hasEnded ? new Date($value["end"]) : null;
        if (!$hasEnded || $end - $begin < SECONDS_IN_A_MONTH * 1000) {
          return (
            <li>
              <span lang="en">
                {$hasEnded ? "From " : "Since "}
                <time datetime={$begin.toISOString()}>{$begin}</time>
                {$hasEnded
                  ? " to " + <time datetime={$end.toISOString()}>{$end}</time>
                  : null}
              </span>
              <span lang="fr">
                {$hasEnded ? "De " : "Depuis "}
                <time datetime={$begin.toISOString()}>{$begin}</time>
                {$hasEnded
                  ? " à " + <time datetime={$end.toISOString()}>{$end}</time>
                  : null}
              </span>
            </li>
          );
        } else {
          // If the current experience did not last more than a month
          return (
            <li>
              <span lang="en">
                <time datetime={$begin.toISOString()}>{$begin}</time>
              </span>
              <span lang="fr">
                <time datetime={$begin.toISOString()}>{$begin}</time>
              </span>
            </li>
          );
        }

      case "website":
        $value = {
          link: $value,
          text: /^https?:\/\/(www\.)?/.replace($value),
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
    }
  }
}

export default function Experience() {
  return Object.entries(experience).map(
    ([
      name,
      {
        missions,
        info = {},
        description = null,
        technologies = null,
        keywords = {},
      },
    ]) => (
      <article>
        <h5>{name}</h5>
        {Object.entries(missions).map(([lang, text]) => (
          <>
            <h6 lang={lang} className="mission">
              {text}
            </h6>
            <ul>
              {Object.entries(info).map(([type, value]) => (
                <ExperienceInfo type={type} value={value} />
              ))}
            </ul>

            {description === null ? null : (
              <details>
                <summary>
                  <FontAwesomeIcon icon="thumb-tack" />
                  {Object.keys(description).map(lang => (
                    <span lang={lang}>
                      {lang in keywords
                        ? keywords[lang].join(" · ")
                        : MORE_INFO[lang]}
                    </span>
                  ))}
                </summary>
                {Object.entries(description).map(([lang, text]) => (
                  <p lang={lang} class="mission">
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
          </>
        ))}
      </article>
    )
  );
}

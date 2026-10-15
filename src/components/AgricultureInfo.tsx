import { Sprout } from "lucide-react";
import type { Farmer } from "../data/types";
import { agricultureCopy } from "../data/agricultureCopy";

export function AgricultureInfo({
  agriculture,
  compact = false,
}: {
  agriculture: Farmer["agriculture"];
  compact?: boolean;
}) {
  return (
    <div className={`agriculture-info ${compact ? "compact" : ""}`}>
      {!compact && (
        <>
          <p className="agriculture-eyebrow">
            <Sprout size={13} />
            {agricultureCopy.brandLabel}
          </p>
          <strong className="agriculture-brand">{agriculture.brand}</strong>
        </>
      )}
      <dl className="agriculture-facts">
        <div>
          <dt>{agricultureCopy.variety}</dt>
          <dd>{agriculture.variety}</dd>
        </div>
        <div>
          <dt>{agricultureCopy.method}</dt>
          <dd>{agriculture.method}</dd>
        </div>
      </dl>
      <p className="agriculture-summary">{agriculture.summary}</p>
      {!compact && (
        <ul
          className="agriculture-practices"
          aria-label={agricultureCopy.practices}
        >
          {agriculture.practices.map((practice) => (
            <li key={practice.title}>
              <span className="practice-sprout" aria-hidden="true">
                <Sprout size={14} />
              </span>
              <div>
                <strong>{practice.title}</strong>
                <p>{practice.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

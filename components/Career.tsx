import { career } from "@/content/profile";
import { RowSection } from "./Section";
import Reveal from "./Reveal";

/**
 * The arc, which an impact-ordered work list no longer implies.
 *
 * A responsive grid rather than a scrolling strip: adjacent top borders meet to
 * form one continuous rule across each row, which gives the timeline look with
 * no horizontal scroll container to get wrong. Evenly spaced on purpose — this
 * is a sequence indicator, not a time-scale chart.
 */
export default function Career() {
  return (
    <RowSection id="career" label="Career">
      <Reveal>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {career.map((stop) => (
            <li
              key={stop.org}
              className="relative border-t border-rule pt-5 pr-6 pb-7"
            >
              <span
                aria-hidden="true"
                className={`absolute -top-[3px] left-0 h-[5px] w-[5px] ${
                  stop.current ? "bg-accent" : "bg-rule-strong"
                }`}
              />
              <p
                className={`font-mono text-[0.75rem] ${
                  stop.current ? "text-accent" : "text-ink-faint"
                }`}
              >
                {stop.dates}
              </p>
              <h3 className="mt-2 font-display text-[1.05rem] leading-snug font-medium">
                {stop.org}
              </h3>
              <p className="label mt-1.5 text-ink-muted">{stop.title}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </RowSection>
  );
}

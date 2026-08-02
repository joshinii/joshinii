import { career } from "@/content/profile";
import { RowSection } from "./Section";
import Reveal from "./Reveal";

/**
 * The overview, directly under the hero: the whole trajectory in one glance,
 * before the reader meets any detail. It carries the chronology that the
 * impact-ordered Work list deliberately doesn't.
 *
 * A responsive grid rather than a scrolling strip — adjacent top borders meet to
 * form one continuous rule across each row, which gives the timeline read with
 * no horizontal scroll container to get wrong. Evenly spaced on purpose: a
 * sequence indicator, not a time-scale chart.
 */
export default function Career() {
  return (
    <RowSection id="career" label="Career" tone="surface">
      <Reveal>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {career.map((stop, i) => (
            <li
              key={stop.org}
              className="relative border-t border-rule-strong pt-5 pr-6 pb-2"
            >
              <span
                aria-hidden="true"
                className={`absolute -top-[3px] left-0 h-[5px] w-[5px] ${
                  stop.current ? "bg-accent" : "bg-rule-strong"
                }`}
              />
              {/* Chevron into the next stop — the sequence made visible. */}
              {i < career.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-[0.6rem] right-5 hidden font-mono text-[0.85rem] leading-none text-rule-strong lg:block"
                >
                  ›
                </span>
              )}
              <p
                className={`font-mono text-[0.75rem] ${
                  stop.current ? "text-accent" : "text-ink-faint"
                }`}
              >
                {stop.dates}
              </p>
              <h3 className="mt-2 font-display text-[1.1rem] leading-snug font-medium">
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

import { focusAreas, intro } from "@/content/profile";
import { Section } from "./Section";
import Reveal from "./Reveal";

/**
 * Answers "what kind of engineer is this" before the reader meets a single
 * date. Each card's proof anchors into the work item that backs it, so the
 * section doubles as navigation.
 */
export default function Focus() {
  return (
    <Section id="focus" label="Focus">
      <Reveal>
        <p className="max-w-[56ch] font-display text-[1.2rem] leading-[1.6] text-ink sm:text-[1.3rem]">
          {intro}
        </p>

        {/* Flex columns so the proof links line up across all three cards. */}
        <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-3">
          {focusAreas.map((area) => (
            <li
              key={area.title}
              className="flex flex-col border-t border-rule pt-5"
            >
              <h3 className="font-display text-[1.15rem] leading-tight font-medium">
                {area.title}
              </h3>
              <p className="mt-3 font-display text-[0.98rem] leading-[1.6] text-ink-muted">
                {area.body}
              </p>
              <a
                href={area.proof.href}
                className="label mt-5 inline-block self-start border-b border-rule-strong pb-1 text-accent transition-colors hover:border-accent sm:mt-auto sm:pt-5"
              >
                {area.proof.label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

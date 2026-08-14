import type { WorkItem as Item } from "@/content/profile";
import { GUTTER_GRID } from "./Section";
import { MetricNote, TechTags } from "./Bits";
import { Cs30System, KafkaRebuild } from "./Diagram";

/**
 * One uniform shape for every piece of work, job or side project alike — the
 * reader learns it once and can then read any card at a glance.
 *
 * The contract: everything that matters is rendered unconditionally. Kind,
 * dates, title, org, headline, result, diagram and the full stack are always
 * visible; only the bullet list sits behind the expander. A 30-second reader
 * never has to click.
 */
export default function WorkItem({ item }: { item: Item }) {
  const ongoing = item.endYear === null;
  const oneShot = item.start === item.end;

  return (
    <li
      id={`work-${item.id}`}
      /*
        Deliberately no `scroll-mt-*` here. `scroll-padding-top` on <html>
        already clears the sticky header for every anchor; scroll-margin stacks
        on top of it rather than replacing it, which landed focus-card links
        ~150px below the header instead of ~35px. A check now asserts the gap.
      */
      className={`relative ${GUTTER_GRID}`}
    >
      <div className="mb-4 flex items-baseline gap-3 lg:mb-0 lg:flex-col lg:items-end lg:gap-1.5 lg:pt-px lg:text-right">
        {/* Always faint: "Now" below is the only accent the gutter gets. */}
        <p className="label text-ink-faint">
          {item.kind === "role" ? "Role" : "Project"}
        </p>
        <p className="font-mono text-[0.75rem] leading-[1.6] text-ink-faint">
          {ongoing ? (
            <>
              <span className="text-accent">Now</span>
              <span className="mx-1.5 lg:hidden">·</span>
              <span className="lg:block">from {item.start}</span>
            </>
          ) : oneShot ? (
            item.start
          ) : (
            <>
              <span>{item.start}</span>
              <span className="mx-1.5 lg:hidden">–</span>
              <span className="lg:block">{item.end}</span>
            </>
          )}
        </p>
      </div>

      <div className="min-w-0">

        <h3 className="font-display text-2xl leading-tight font-medium text-balance">
          {item.title}
        </h3>

        {(item.org || item.role || item.context) && (
          <p className="label mt-2 text-ink-muted">
            {[item.org, item.role, item.context].filter(Boolean).map((part, i) => (
              <span key={part}>
                {i > 0 && <span className="mx-2 text-rule-strong">/</span>}
                {part}
              </span>
            ))}
          </p>
        )}

        <p className="mt-5 max-w-[60ch] font-display text-[1.1rem] leading-[1.65] text-ink">
          {item.headline}
        </p>

        {item.result && (
          <MetricNote value={item.result.value} label={item.result.label} />
        )}

        {item.diagram === "kafka" && <KafkaRebuild />}
        {item.diagram === "cs30" && <Cs30System />}

        <TechTags items={item.tech} />

        {item.detail.length > 0 && (
          <details className="mt-7 border-t border-rule pt-4">
            <summary className="label flex w-fit cursor-pointer list-none items-center gap-2 text-ink-muted transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
              {/*
                Rotation lives in globals.css as `details[open] .disclosure-caret`.
                Neither `group-open:` nor an arbitrary `[[open]_&]` variant
                produced a rule here, and a plain CSS selector is clearer than
                fighting the variant syntax.
              */}
              <span aria-hidden="true" className="disclosure-caret">
                ›
              </span>
              Details
            </summary>
            <ul className="mt-5 max-w-[62ch] space-y-3 font-display text-[1.02rem] leading-[1.65] text-ink-muted">
              {item.detail.map((line) => (
                <li key={line.slice(0, 24)} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.7rem] h-px w-3 shrink-0 bg-rule-strong"
                  />
                  <span className="min-w-0">{line}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Absent rather than empty until the URLs are supplied. */}
        {item.links.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {item.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label border-b border-rule-strong pb-1 text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

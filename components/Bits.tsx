/**
 * Small shared pieces. The rail tick and tie are what physically connect an
 * entry to the spine; everything else here is typographic.
 */

/**
 * A rung on the ladder: a square on the rail plus a hairline running from it
 * toward the content.
 *
 * Both spans resolve against the nearest positioned ancestor, which is the
 * `relative` grid row — NOT the content column they're nested in. So the
 * offset is measured from the row's left edge, and `7.5rem` is the gutter
 * width, i.e. exactly where Spine puts the rail. Keep the two in step.
 */
export function RailTick() {
  return (
    <span aria-hidden="true" className="hidden lg:block">
      <span className="absolute top-[0.45rem] left-[7.5rem] h-[5px] w-[5px] -translate-x-1/2 bg-rule-strong" />
      {/* Spans the gutter gap so the rung actually reaches the entry. */}
      <span className="tie absolute top-[0.45rem] left-[7.5rem] h-px w-10" />
    </span>
  );
}

export function TechTags({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="border border-rule px-2 py-[0.3rem] font-mono text-[0.7rem] leading-none text-ink-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Dates, right-aligned against the rail in the gutter. Callers pass the exact
 * strings rather than a date range, because not every entry has both ends on
 * record — an invented start date would be worse than a missing one.
 */
export function GutterYears({
  top,
  bottom,
  accent = false,
}: {
  top: string;
  bottom?: string;
  accent?: boolean;
}) {
  return (
    <div className="mb-3 font-mono text-[0.75rem] leading-[1.6] text-ink-faint lg:mb-0 lg:pt-px lg:text-right">
      <span className={accent ? "text-accent" : undefined}>{top}</span>
      {bottom && (
        <>
          <span className="mx-1.5 lg:hidden">·</span>
          <span className="lg:block">{bottom}</span>
        </>
      )}
    </div>
  );
}

/** A number pulled out of the prose. Quiet — the hero owns the loud one. */
export function MetricNote({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <p className="mt-6 flex flex-wrap items-baseline gap-x-3 border-l-2 border-accent pl-4">
      <span className="font-mono text-base text-accent">{value}</span>
      <span className="label text-ink-muted">{label}</span>
    </p>
  );
}

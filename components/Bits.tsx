/** Small shared pieces. All typographic — the rail they used to hang off is gone. */

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
 * Dates, right-aligned in the gutter. Callers pass the exact
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

/**
 * Sections share one grid template: a left gutter that rides the spine,
 * then the content column. Because every row reuses this exact template, the
 * gutter — and therefore the rail — stays aligned down the whole page.
 */
export const GUTTER_GRID = "lg:grid lg:grid-cols-[7.5rem_1fr] lg:gap-x-10";

// No scroll-mt here: scroll-padding-top on <html> already clears the sticky
// header, and scroll-margin would stack on top of it.
const SHELL = "border-t border-rule pt-8 pb-20 sm:pb-24";

/** Label in the gutter, prose in the content column. For undated sections. */
export function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className={`${SHELL} ${GUTTER_GRID}`}>
      <h2 id={`${id}-label`} className="label mb-7 text-ink-faint lg:mb-0">
        {label}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/**
 * For sections whose rows each need their own gutter — years, group names.
 * The label takes the gutter of a leading one-row grid so it lines up with the
 * gutters below it.
 */
export function RowSection({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className={SHELL}>
      <div className={GUTTER_GRID}>
        <h2 id={`${id}-label`} className="label text-ink-faint">
          {label}
        </h2>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/**
 * Section shells.
 *
 * There used to be a continuous hairline rail at the gutter boundary. It was
 * removed: it spanned every section at a fixed offset while the filter bar and
 * career strip render full-width, so it cut straight through them — and once
 * Work became impact-ordered rather than chronological, the rail had no meaning
 * left to justify the collisions.
 *
 * Sections differentiate themselves by **tone** instead:
 *
 * - `paper`   — the default. Separated from what precedes it by a hairline.
 * - `surface` — a full-bleed warm tint, no rule (the tint is the separation).
 *   Used for the two overview shelves, Career and Background, which frame the
 *   main content between them.
 *
 * The band is full-bleed, so the max-width container lives *inside* each
 * section rather than around all of them.
 */

export const CONTAINER = "mx-auto w-full max-w-4xl px-6 sm:px-8";
export const GUTTER_GRID = "lg:grid lg:grid-cols-[7.5rem_1fr] lg:gap-x-10";

export type Tone = "paper" | "surface";

const band = (tone: Tone) => (tone === "surface" ? "bg-surface" : "");

const inner = (tone: Tone) =>
  tone === "surface"
    ? `${CONTAINER} py-14 sm:py-16`
    : `${CONTAINER} border-t border-rule pt-9 pb-20 sm:pb-24`;

/** Label in the gutter, content in the column beside it. */
export function Section({
  id,
  label,
  tone = "paper",
  children,
}: {
  id: string;
  label: string;
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className={band(tone)}>
      <div className={`${inner(tone)} ${GUTTER_GRID}`}>
        <h2 id={`${id}-label`} className="label mb-7 text-ink-faint lg:mb-0">
          {label}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/**
 * For sections whose rows each need their own gutter — dates, group names. The
 * label takes the gutter of a leading one-row grid so it lines up with the
 * gutters below it.
 */
export function RowSection({
  id,
  label,
  tone = "paper",
  children,
}: {
  id: string;
  label: string;
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className={band(tone)}>
      <div className={inner(tone)}>
        <div className={GUTTER_GRID}>
          <h2 id={`${id}-label`} className="label text-ink-faint">
            {label}
          </h2>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

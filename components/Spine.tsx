/**
 * The gutter rail.
 *
 * This began life as a "chronological spine" — the idea being that scrolling
 * the page scrolled the career. That justification is gone: the work list is
 * now ordered by strength, not by date, so the dates beside the rail no longer
 * ascend. **Chronology lives in the Career strip now.**
 *
 * What the rail still honestly does: it anchors the gutter/content boundary
 * that every section grid shares, and the sticky marker shows scroll position.
 * The marker tracks the viewport with no JavaScript and no scroll listener —
 * `position: sticky` inside a full-height element does all of it.
 *
 * Hidden below `lg`, where the gutter collapses and metadata runs inline.
 */
export default function Spine() {
  return (
    <div
      aria-hidden="true"
      className="spine-rail pointer-events-none absolute inset-y-0 left-[7.5rem] hidden w-px lg:block"
    >
      <div className="sticky top-[46vh] -ml-[3px] h-[7px] w-[7px] bg-accent" />
    </div>
  );
}

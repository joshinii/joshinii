"use client";

import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { alsoWorkedWith, filterTopics, work } from "@/content/profile";
import { RowSection } from "./Section";
import WorkItem from "./WorkItem";

/**
 * Jobs and side projects in one list, ordered by strength rather than by date.
 *
 * The chips replace what used to be a 46-tag skills wall: instead of asserting
 * a list of technologies, they let a reader ask which work used one. That is
 * the affordance a PDF doesn't have, and it's why the wall is gone.
 */
export default function Work() {
  const [topic, setTopic] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of filterTopics) {
      map.set(t, work.filter((item) => item.topics.includes(t)).length);
    }
    return map;
  }, []);

  const shown = topic
    ? work.filter((item) => item.topics.includes(topic))
    : work;

  /**
   * Filtered-out items leave the DOM, which silently turns the Focus section's
   * proof links (`#work-kafka` and friends) into no-ops whenever the active chip
   * excludes their target. A reader who clicks "20 min → 5 min" is asking for
   * that one item, so the filter yields to them.
   *
   * Listening for the click rather than `hashchange`, because re-clicking a link
   * for the hash already in the URL fires no hashchange at all — the exact case
   * where a filter has since hidden the target. `flushSync` renders the item
   * before we scroll to it; without it there is nothing to scroll to yet.
   */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(
        'a[href^="#work-"]',
      );
      if (!link) return;

      const id = decodeURIComponent(
        link.getAttribute("href")!.slice(1),
      );
      // Already on screen — leave it to the browser's own fragment navigation.
      if (document.getElementById(id)) return;

      flushSync(() => setTopic(null));
      document.getElementById(id)?.scrollIntoView();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const chip = (active: boolean) =>
    `cursor-pointer border px-2 py-[0.3rem] font-mono text-[0.72rem] leading-none transition-colors ${
      active
        ? "border-accent bg-accent-soft text-accent"
        : "border-rule bg-paper text-ink-muted hover:border-rule-strong hover:text-ink"
    }`;

  return (
    <RowSection id="work" label="Work">
      {/*
        Boxed and tinted so it reads as a control surface rather than as loose
        content. Previously it sat bare and full-width, which made it look like
        stray text — and collided with the old gutter rail.
      */}
      <div className="border border-rule bg-surface px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="label mr-1 shrink-0 text-ink-faint">Filter by</span>
          <button
            type="button"
            aria-pressed={topic === null}
            onClick={() => setTopic(null)}
            className={chip(topic === null)}
          >
            Everything
          </button>
          {filterTopics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(topic === t ? null : t)}
              className={chip(topic === t)}
            >
              {t}
              <span className="ml-1.5 text-ink-faint">{counts.get(t)}</span>
            </button>
          ))}
        </div>

        <p
          role="status"
          className="label mt-3.5 border-t border-rule pt-3 text-ink-muted"
        >
          {topic
            ? `${shown.length} of ${work.length} — ${topic}`
            : `${work.length} items, strongest first`}
        </p>
      </div>

      {/*
        Filtered-out items leave the DOM rather than hiding, so Ctrl+F and
        screen readers agree with what's on screen.
      */}
      <ol className="mt-14 space-y-16">
        {shown.map((item) => (
          <WorkItem key={item.id} item={item} />
        ))}
      </ol>

      <p className="mt-16 max-w-[64ch] border-t border-rule pt-5 font-mono text-[0.72rem] leading-[1.9] text-ink-faint">
        <span className="label mr-2 text-ink-muted">Also</span>
        {alsoWorkedWith.join(" · ")}
      </p>
    </RowSection>
  );
}

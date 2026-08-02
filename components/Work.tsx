"use client";

import { useMemo, useState } from "react";
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

  const chip = (active: boolean) =>
    `cursor-pointer border px-2.5 py-[0.35rem] font-mono text-[0.75rem] leading-none transition-colors ${
      active
        ? "border-accent text-accent"
        : "border-rule text-ink-muted hover:border-rule-strong hover:text-ink"
    }`;

  return (
    <RowSection id="work" label="Work">
      <div className="border-t border-rule pt-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <span className="label mr-1 text-ink-faint">Filter</span>
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

        <p role="status" className="label mt-4 text-ink-muted">
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

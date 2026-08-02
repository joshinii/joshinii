import { contact, heroFacts, positioning } from "@/content/profile";
import { CONTAINER } from "./Section";

/**
 * The hero opens on the most characteristic thing in her work: a queue that
 * used to take twenty minutes and now takes five. Everything else here is
 * quiet so that one number carries the page.
 */
export default function Hero() {
  return (
    <section id="top" className={`${CONTAINER} pt-12 pb-14 sm:pt-16 sm:pb-16`}>
      <p className="label text-ink-faint">
        {contact.role}
        <span className="mx-2 text-rule-strong">/</span>
        {contact.location}
      </p>

      <h1 className="mt-6 font-display text-[clamp(2rem,7.6vw,4.6rem)] leading-[0.93] font-normal tracking-[-0.022em] text-balance">
        Joshini
        <br />
        M.
        <br />
        Naagraj
      </h1>

      <p className="mt-7 max-w-[34ch] font-display text-2xl leading-[1.35] text-ink-muted italic sm:text-[1.75rem]">
        {positioning}
      </p>

      {/* The one artifact. Before in faint ink, after in accent. */}
      <div className="mt-11 border-t border-rule pt-6">
        <p className="font-mono text-[clamp(1.5rem,5vw,2.25rem)] leading-none tracking-tight">
          <span className="text-ink-faint">20 min</span>
          {/* This arrow carries meaning, so it gets a legible tone, not a hairline one. */}
          <span className="mx-3 text-ink-faint" aria-hidden="true">
            →
          </span>
          <span className="text-accent">5 min</span>
        </p>
        <p className="label mt-4 max-w-[68ch] text-[0.72rem] leading-[1.7] text-ink-muted">
          Queued message processing, after rebuilding a Java monolith into Kafka
          services at LTIMindtree
        </p>
      </div>

      {/*
        The four things a recruiter screens on, above the fold. Mono label
        voice, hairline rules — a specification, not a stat-tile row.
      */}
      <dl className="mt-10 grid gap-x-10 border-t border-rule sm:grid-cols-2">
        {heroFacts.map((fact) => (
          <div
            key={fact.term}
            className="flex flex-col gap-1 border-b border-rule py-3.5 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <dt className="label shrink-0 text-ink-faint sm:w-[5.5rem]">
              {fact.term}
            </dt>
            <dd className="font-mono text-[0.8rem] leading-[1.5] text-ink-muted">
              {fact.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
        <a
          href={contact.resume}
          download
          className="label bg-accent px-5 py-3.5 text-paper transition-opacity hover:opacity-85"
        >
          Download résumé
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="label border-b border-rule-strong pb-1 text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {contact.email}
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noreferrer"
          className="label border-b border-rule-strong pb-1 text-ink transition-colors hover:border-accent hover:text-accent"
        >
          LinkedIn
        </a>
        {contact.github && (
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="label border-b border-rule-strong pb-1 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            GitHub
          </a>
        )}
      </div>
    </section>
  );
}

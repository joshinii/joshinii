import { contact } from "@/content/profile";
import { Section } from "./Section";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <Section id="contact" label="Contact">
      <Reveal>
        <p className="max-w-[52ch] font-display text-[1.35rem] leading-[1.5] text-ink sm:text-2xl">
          I&rsquo;m looking for backend and platform work — JVM services,
          distributed systems, the parts that have to stay up. If that&rsquo;s
          what you&rsquo;re building, write to me.
        </p>

        <a
          href={`mailto:${contact.email}`}
          className="mt-10 inline-block max-w-full font-display text-[clamp(1.5rem,5.5vw,2.5rem)] leading-tight tracking-tight break-words text-ink underline decoration-rule-strong decoration-1 underline-offset-[0.3em] transition-colors hover:text-accent hover:decoration-accent"
        >
          {contact.email}
        </a>

        <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-4">
          <li>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="label border-b border-rule-strong pb-1 text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {contact.linkedinLabel} ↗
            </a>
          </li>
          {contact.github && (
            <li>
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                className="label border-b border-rule-strong pb-1 text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {contact.githubLabel} ↗
              </a>
            </li>
          )}
          <li>
            <a
              href={contact.resume}
              download
              className="label border-b border-rule-strong pb-1 text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Résumé ↓
            </a>
          </li>
        </ul>
      </Reveal>
    </Section>
  );
}

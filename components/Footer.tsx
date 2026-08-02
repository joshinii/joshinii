import { contact } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 py-10 sm:px-8">
        <p className="label text-ink-faint">
          {contact.name}
          <span className="mx-2 text-rule-strong">/</span>
          {contact.location}
        </p>
        <p className="label text-ink-faint">
          Set in Newsreader &amp; IBM Plex Mono
        </p>
      </div>
    </footer>
  );
}

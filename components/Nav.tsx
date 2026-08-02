"use client";

import { useEffect, useState } from "react";
import { contact, sections } from "@/content/profile";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (inView[0]) setActive(inView[0].target.id);
      },
      // A narrow band under the header decides what counts as "current".
      { rootMargin: "-18% 0px -72% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-6 px-6 py-4 sm:px-8">
        <a
          href="#top"
          className="font-display text-base leading-none font-medium tracking-tight whitespace-nowrap text-ink transition-colors hover:text-accent"
        >
          {contact.shortName}
        </a>

        {/*
          Not `md`: at 768px the name plus six links plus résumé plus toggle
          overflow the container. They only fit from lg up.
        */}
        <nav aria-label="Sections" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-5">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active === section.id ? "true" : undefined}
                  className={`label transition-colors hover:text-accent ${
                    active === section.id ? "text-accent" : "text-ink-muted"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-5 lg:ml-8">
          <a
            href={contact.resume}
            download
            className="label text-ink-muted transition-colors hover:text-accent"
          >
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </div>

      {/*
        Below lg the links above are hidden, which left phones with no way to
        jump at all. Same scroll-spy state, scrolling inside its own container
        so the page itself never scrolls sideways.
      */}
      <nav
        aria-label="Sections"
        className="overflow-x-auto border-t border-rule lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-5 px-6 py-3 sm:px-8">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active === section.id ? "true" : undefined}
                className={`label whitespace-nowrap transition-colors ${
                  active === section.id ? "text-accent" : "text-ink-muted"
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

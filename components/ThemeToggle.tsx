"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * The effective theme lives in the DOM (`data-theme`) and the OS preference,
 * not in React state — the inline script in layout.tsx already resolved it
 * before first paint. So this subscribes to those two external sources rather
 * than mirroring them into state, which is what `useSyncExternalStore` is for
 * and what keeps `react-hooks/set-state-in-effect` satisfied.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  listeners.add(onChange);
  return () => {
    media.removeEventListener("change", onChange);
    listeners.delete(onChange);
  };
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Unknowable on the server; the button renders label-less for one paint. */
function getServerSnapshot(): Theme | null {
  return null;
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing — the theme still applies for this page view.
    }
    listeners.forEach((notify) => notify());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Switch theme"
      }
      className="label cursor-pointer text-ink-faint transition-colors hover:text-accent"
    >
      {/* Reserve the wider word's width so the header never reflows. */}
      <span className="inline-block w-[3.25rem] text-right">
        {theme === "dark" ? "Dark" : theme === "light" ? "Light" : ""}
      </span>
    </button>
  );
}

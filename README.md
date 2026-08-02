# joshini-portfolio

Single-page portfolio for Joshini Meenakshisundaram Naagraj. Next.js 16 (App
Router) + Tailwind 4, deployed on Vercel.

```bash
npm run dev            # http://localhost:3000
npm run build          # production build
npm run check          # 34 browser checks against a running dev server
npm run resume:build   # recompile the downloadable PDF (needs typst)
```

`npm run check` drives headless Chrome over CDP and asserts the things that are
easy to break and hard to eyeball: horizontal overflow at 375/768/1440, the
theme toggle beating the OS preference in both directions and surviving a
reload, reduced motion, WCAG AA contrast in both themes, dead links, heading
order, diagram accessibility, anchors clearing the sticky header, and the work
filter and disclosures behaving. Start `npm run dev` first.

One harness quirk worth knowing: a throttled headless page produces no frames,
so its animation clock never ticks — CSS transitions stay pinned at their start
value and smooth scrolling never advances. Assertions that would otherwise
sample a mid-transition value call `freezeTransitions()` or emulate reduced
motion first. `prefers-reduced-motion` alone is not enough; it shortens
transitions to 0.01ms rather than removing them, and with a frozen clock even
that never completes.

## Where the content lives

Everything on the page comes from **`content/profile.ts`** — one typed module,
no CMS and no build-time parsing. It was transcribed by hand from
`/Users/spartan/Projects/tailored-resume-system/user_data/structured_profile.yaml`;
when that YAML changes, re-sync this file. Nothing at runtime depends on that
directory.

**This is not a résumé in HTML, and the data model is where that starts.** Jobs
and side projects live in one `work` array, and each item is titled by *what was
built* rather than by who paid for it — LTIMindtree is not a heading, "Monolith
→ Kafka services" is, with the employer as a subtitle. The array is ordered by
strength, not by date; chronology is the Career strip's job.

Each work item carries two separate technology lists, and mixing them up will
quietly break the filter:

- **`tech`** — the precise stack, displayed in full on the card.
- **`topics`** — normalised tags the filter matches on. An item using Lambda, S3
  and SQS must carry the `AWS` topic; substring-matching `tech` would not find
  it. Every entry in `filterTopics` must match at least one item, and a check
  enforces that no chip returns zero results.

Two fields are deliberately left empty until someone supplies them:

- `contact.github` / `contact.githubLabel` — set both to switch the GitHub links
  on in the header, hero, and contact section. Every consumer null-checks them.
- `work[].links` — repo and demo URLs. An item with an empty array renders no
  link row at all, rather than an empty one.

## Design notes

Two typefaces, each with one job: **Newsreader** for display and body prose,
**IBM Plex Mono** for every piece of technical metadata (labels, dates, tech
tags, nav). Palette is warm neutrals with a single burnt-sienna accent — no pure
white, no pure black, no shadows, no border radius.

The page reads Hero → Focus → Work → Career → Background → Contact. **Focus**
answers what kind of engineer she is before the reader meets a date, and each
card's proof anchors into the work item backing it. **Work** is the unified list
with the filter above it; the filter is what replaced a 46-chip skills wall.

Every work card keeps one promise: *collapsed never hides substance*. Kind,
dates, title, org, headline, result, diagram and full stack are always
rendered — only the bullet list sits behind the native `<details>`. A check
asserts this, because it's the assumption the whole layout rests on.

The rail on the gutter/content boundary began as a "chronological spine", but
Work is ordered by strength now, so its dates no longer ascend. It survives as
an alignment device and a scroll-position marker only — **chronology lives in
the Career strip**. Three files must agree on the gutter width
(`7.5rem`) for it to line up — `components/Section.tsx` (`GUTTER_GRID`),
`components/Spine.tsx`, and `RailTick` in `components/Bits.tsx`.

Themes resolve from `prefers-color-scheme`, and the toggle overrides the OS in
both directions — see the specificity note at the top of `app/globals.css`. An
inline script in `app/layout.tsx` applies the stored choice before first paint.

All three ink tones clear WCAG AA (4.5:1) against their own background, in both
themes, because all three carry real text — `ink-faint` is the 11px mono label
voice, not a decorative tint.

Sticky-header clearance lives in exactly one place: `scroll-padding-top` on
`<html>` in `app/globals.css`, which is larger below `lg` because the header
carries a second row there (the mobile section nav). Do not add `scroll-mt-*`
to sections — scroll-margin stacks on top of scroll-padding and double-offsets
every anchor.

## Diagrams

`components/Diagram.tsx` holds two inline-SVG architecture diagrams — the Kafka
rebuild in the LTIMindtree entry, and the CS30 system in the featured project.
Three rules they have to keep:

- **Nothing invented.** The source profile doesn't name the individual services
  in the Kafka rebuild, so the nodes stay generic. A diagram is not licence to
  make up detail that isn't on record.
- **Two variants each.** A wide `viewBox` scaled to a 320px phone renders 11px
  labels at about 5px, so each diagram ships a side-by-side version
  (`hidden sm:block`) and a stacked one (`sm:hidden`).
- **`<title>` and `<desc>` on every one.** The `<desc>` restates the same facts
  in prose, so a diagram is never the only place information exists. The check
  suite asserts this.

## The résumé PDF

`resume/resume.typ` is a copy of the most recent résumé from the
tailored-resume-system repo, with the phone number removed from the header — the
site intentionally publishes only email and LinkedIn. `npm run resume:build`
recompiles it into `public/`.

To verify the phone stays out:

```bash
pdftotext public/Joshini_Meenakshisundaram_Naagraj_Resume.pdf - | grep -c 209   # want 0
```

Note that this PDF predates the CS30 Secure Coding Lab project and does not list
it, while the site features it first.

## Fonts in the OG image

`app/opengraph-image.tsx` reads TTFs from `assets/fonts/`. satori can't use the
`next/font` webfonts and doesn't read woff2, and it rejects variable fonts — so
those two files are **static** instances, not the variable originals. Replacing
them with variable builds will break the OG route.

## Deploying

Vercel needs no configuration. Set `NEXT_PUBLIC_SITE_URL` to the production
origin so canonical URLs, `sitemap.xml`, `robots.txt`, and OG tags point at the
real domain instead of the fallback.

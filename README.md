# joshini-portfolio

Single-page portfolio for Joshini M Naagraj. Next.js 16 (App
Router) + Tailwind 4, deployed on Vercel.

```bash
npm run dev            # http://localhost:3000
npm run build          # production build
npm run check          # 38 browser checks against a running dev server
npm run resume:build   # recompile the downloadable PDF (needs typst)
```

`npm run check` drives headless Chrome over CDP and asserts the things that are
easy to break and hard to eyeball: horizontal overflow at 375/768/1440, the
theme toggle beating the OS preference in both directions and surviving a
reload, reduced motion, WCAG AA contrast in both themes, dead links, heading
order, diagram accessibility, anchors clearing the sticky header, and the work
filter and disclosures behaving. Start `npm run dev` first.

Four of those checks exist because prose in this file failed to prevent the bug,
so treat them as load-bearing:

- **Every in-page fragment resolves to an element.** A non-empty `href` is not
  enough — `#about` outlived the section it pointed at, and the skip link
  silently skipped nothing while the dead-link check passed it.
- **`#work-kafka` lands just below the sticky header, at both widths.** This is
  the `scroll-mt` / `scroll-padding` stacking trap described under Design notes.
- **A Focus proof link still works under an excluding filter.** Filtered-out
  items leave the DOM, so the chips could turn the Focus section's deep links
  into no-ops.

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

The page reads Hero → Career → Focus → Work → Background → Contact. **Career**
sits directly under the hero as the overview, so a reader gets the whole
trajectory in one glance before meeting any detail. **Focus** then answers what
kind of engineer she is, and each card's proof anchors into the work item backing
it. **Work** supplies the evidence — the unified list with the filter above it,
which is what replaced a 46-chip skills wall.

Because those Focus proof links point at individual work items, and an active
filter removes non-matching items from the DOM, `components/Work.tsx` clears the
filter when one is clicked. It listens for the click rather than `hashchange`,
since re-clicking a link for the hash already in the URL fires no hashchange —
exactly the case where a filter has since hidden the target.

Every work card keeps one promise: *collapsed never hides substance*. Kind,
dates, title, org, headline, result, diagram and full stack are always
rendered — only the bullet list sits behind the native `<details>`. A check
asserts this, because it's the assumption the whole layout rests on.

There used to be a continuous hairline rail on the gutter/content boundary,
begun as a "chronological spine". **It is gone** — it sat at a fixed offset
across every section while the filter bar and career strip render full-width, so
it cut straight through them, and once Work became impact-ordered its dates no
longer ascended, leaving nothing to justify the collisions. **Chronology lives in
the Career strip.**

Sections differentiate by **tone** instead, per `components/Section.tsx`:
`paper` (the default, separated by a hairline) and `surface` (a full-bleed warm
tint with no rule, used for the two overview shelves — Career and Background —
that frame the main content). The gutter width (`7.5rem`) now lives in exactly
one place, `GUTTER_GRID` in that same file.

Themes resolve from `prefers-color-scheme`, and the toggle overrides the OS in
both directions — see the specificity note at the top of `app/globals.css`. An
inline script in `app/layout.tsx` applies the stored choice before first paint.

All three ink tones clear WCAG AA (4.5:1) against their own background, in both
themes, because all three carry real text — `ink-faint` is the 11px mono label
voice, not a decorative tint.

Sticky-header clearance lives in exactly one place: `scroll-padding-top` on
`<html>` in `app/globals.css`, which is larger below `lg` because the header
carries a second row there (the mobile section nav). Do not add `scroll-mt-*` to
**any** anchor target — not sections, and not the work-item `<li>`s the Focus
cards link into. Scroll-margin stacks on top of scroll-padding rather than
replacing it, so it double-offsets the anchor: a `scroll-mt-32` on the work items
landed them ~150px below the header instead of ~35px. Two checks now assert the
gap, for a section anchor and for a work-item deep link.

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
pdftotext public/Joshini_M_Naagraj_Resume.pdf - | grep -c 209   # want 0
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
origin so `metadataBase`, `sitemap.xml`, `robots.txt`, and the OG/Twitter tags
point at the real domain instead of the fallback. Three files read it
independently — `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` — each with
the same hardcoded fallback, so change all three together.

Note there is currently **no** `rel="canonical"` tag; `metadata` sets no
`alternates`. Worth adding (`alternates: { canonical: "/" }` in
`app/layout.tsx`) once the site is reachable at both a `vercel.app` subdomain
and a custom domain.

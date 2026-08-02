// Automated verification of the plan's checklist items via CDP.
import { spawn } from "node:child_process";

// Preflight. Results are only printed at the very end, so without this a dead
// dev server surfaces as a confusing TypeError hundreds of lines later.
try {
  const res = await fetch("http://localhost:3000", { method: "HEAD" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
} catch (err) {
  console.error(
    `Cannot reach http://localhost:3000 (${err.message}). Start it with \`npm run dev\` first.`,
  );
  process.exit(2);
}

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9412;
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=/tmp/checks-profile", "about:blank",
], { stdio: "ignore" });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function page() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = list.find((t) => t.type === "page");
      if (p) return p;
    } catch {}
    await wait(250);
  }
  throw new Error("no chrome");
}

const target = await page();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
};
const send = (method, params = {}) => new Promise((res) => {
  const mid = ++id; pending.set(mid, res);
  ws.send(JSON.stringify({ id: mid, method, params }));
});
/**
 * A throttled headless page doesn't produce frames, so its animation clock
 * never ticks: CSS transitions stay pinned at their start value and smooth
 * scrolling never advances. Any assertion that would otherwise sample a
 * transitioning value therefore emulates `prefers-reduced-motion: reduce`,
 * which the site's own CSS turns into ~instant transitions and `scroll-behavior:
 * auto`. That makes the END STATE — the thing actually under test — observable.
 */
const REDUCE = { name: "prefers-reduced-motion", value: "reduce" };

/**
 * `prefers-reduced-motion` only shortens transitions to 0.01ms — with a frozen
 * clock even that never completes. This removes them outright so computed
 * styles are final the moment they're set. Must be re-applied after every
 * navigation, since it injects into the document.
 */
const freezeTransitions = () => evalJs(`(() => {
  if (document.getElementById('__no-transitions')) return true;
  const st = document.createElement('style');
  st.id = '__no-transitions';
  st.textContent = '*,*::before,*::after{transition:none !important;animation:none !important}';
  document.head.appendChild(st);
  return true;
})()`);

/**
 * Poll an expression until it satisfies `ok`, or give up. Fixed sleeps made
 * the theme and scroll assertions flaky — and worse, the scroll one passed
 * vacuously because a smooth scroll of ~2000px hadn't finished in 1.4s.
 */
const waitUntil = async (expression, ok, timeout = 4000, step = 150) => {
  const deadline = Date.now() + timeout;
  let last;
  for (;;) {
    last = await evalJsRaw(expression);
    if (ok(last)) return last;
    if (Date.now() > deadline) return last;
    await wait(step);
  }
};

const evalJs = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return r?.result?.value;
};
const evalJsRaw = (expression) => evalJs(expression);

await send("Page.enable");
const results = [];
const check = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);

// ---- 1. Horizontal overflow at three widths ----
for (const [w, h] of [[375, 800], [768, 900], [1440, 900]]) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 500 });
  await send("Page.navigate", { url: "http://localhost:3000" });
  await wait(2200);
  const over = await evalJs(`(() => {
    const de = document.documentElement;
    const widest = [...document.querySelectorAll('body *')]
      .filter(el => el.getBoundingClientRect().right > de.clientWidth + 1)
      .map(el => el.tagName + '.' + (el.className || '').toString().slice(0, 40));
    return { scrollW: de.scrollWidth, clientW: de.clientWidth, offenders: widest.slice(0, 4) };
  })()`);
  check(`no horizontal overflow @ ${w}px`,
    over.scrollW <= over.clientW + 1,
    `scrollW=${over.scrollW} clientW=${over.clientW}` +
      (over.scrollW > over.clientW + 1 ? " offenders=" + JSON.stringify(over.offenders) : ""));
}

// ---- 2. Theme toggle must beat the OS preference in BOTH directions ----
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

for (const os of ["dark", "light"]) {
  const forced = os === "dark" ? "light" : "dark";
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: os }, REDUCE],
  });
  await send("Page.navigate", { url: "http://localhost:3000" });

  await wait(2000);
  await freezeTransitions();

  const bgDefault = await evalJs(`getComputedStyle(document.body).backgroundColor`);
  // Click the toggle the way a user would.
  await evalJs(`document.querySelector('header button[aria-label*="theme"]').click()`);
  await wait(500);
  const bgForced = await waitUntil(
    `getComputedStyle(document.body).backgroundColor`,
    (v) => v === (forced === "dark" ? "rgb(21, 18, 14)" : "rgb(250, 247, 242)"),
  );
  const attr = await evalJs(`document.documentElement.getAttribute('data-theme')`);
  const stored = await evalJs(`localStorage.getItem('theme')`);

  const darkBg = "rgb(21, 18, 14)";
  const lightBg = "rgb(250, 247, 242)";
  const expectDefault = os === "dark" ? darkBg : lightBg;
  const expectForced = forced === "dark" ? darkBg : lightBg;

  check(`OS=${os} renders ${os} by default`, bgDefault === expectDefault, `body bg ${bgDefault}`);
  check(`OS=${os} + toggle -> ${forced} wins`, bgForced === expectForced && attr === forced,
    `body bg ${bgForced}, data-theme=${attr}`);
  check(`OS=${os} choice persisted`, stored === forced, `localStorage.theme=${stored}`);

  // Reload and confirm it sticks (this is the flash-of-wrong-theme path).
  await send("Page.reload", { ignoreCache: false });
  await wait(1800);
  await freezeTransitions();
  const bgAfter = await waitUntil(
    `getComputedStyle(document.body).backgroundColor`,
    (v) => v === expectForced,
  );
  check(`OS=${os} choice survives reload`, bgAfter === expectForced, `body bg ${bgAfter}`);
  await evalJs(`localStorage.removeItem('theme')`);
}

// ---- 3. Reduced motion: content must be visible with nothing to animate ----
await send("Emulation.setEmulatedMedia", {
  features: [
    { name: "prefers-color-scheme", value: "light" },
    { name: "prefers-reduced-motion", value: "reduce" },
  ],
});
await send("Page.navigate", { url: "http://localhost:3000" });
await wait(2200);
const rm = await evalJs(`(() => {
  const reveals = [...document.querySelectorAll('.reveal')];
  const hidden = reveals.filter(el => Number(getComputedStyle(el).opacity) < 0.99);
  return { total: reveals.length, hidden: hidden.length };
})()`);
check("reduced motion: all reveals fully opaque", rm.hidden === 0, `${rm.total - rm.hidden}/${rm.total} visible`);

// ---- 4. No dead links, and the resume actually resolves ----
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }] });
await send("Page.navigate", { url: "http://localhost:3000" });
await wait(2200);
const links = await evalJs(`(() => {
  const as = [...document.querySelectorAll('a')];
  return {
    dead: as.filter(a => { const h = a.getAttribute('href'); return !h || h === '#' || h === ''; })
            .map(a => a.textContent.trim().slice(0, 30)),
    hrefs: as.map(a => a.getAttribute('href')),
  };
})()`);
check("no dead links", links.dead.length === 0, links.dead.length ? JSON.stringify(links.dead) : `${links.hrefs.length} links`);

const res = await evalJs(`fetch('/Joshini_M_Naagraj_Resume.pdf', {method:'HEAD'}).then(r => r.status + ' ' + r.headers.get('content-type'))`);
check("resume PDF resolves", String(res).startsWith("200"), String(res));

const og = await evalJs(`fetch('/opengraph-image', {method:'GET'}).then(r => r.status + ' ' + r.headers.get('content-type'))`);
check("OG image renders", String(og).startsWith("200") && String(og).includes("image/png"), String(og));

// ---- 5. Keyboard focus ring on interactive elements ----
const focus = await evalJs(`(() => {
  // Only elements actually rendered at this width. The mobile nav is
  // display:none above lg, so it is legitimately unfocusable here.
  const els = [...document.querySelectorAll('a[href], button')]
    .filter(el => el.getBoundingClientRect().width > 0 || el.closest('.sr-only, [class*="sr-only"]'));
  const problems = [];
  for (const el of els) {
    el.focus();
    if (document.activeElement !== el) {
      problems.push(el.tagName + ':' + el.textContent.trim().slice(0, 20));
    }
  }
  return { count: els.length, problems };
})()`);
check("all visible links/buttons are focusable", focus.problems.length === 0,
  `${focus.count} visible${focus.problems.length ? " — " + JSON.stringify(focus.problems) : ""}`);

// ---- 6. Landmarks + heading order ----
const a11y = await evalJs(`(() => ({
  main: document.querySelectorAll('main').length,
  header: document.querySelectorAll('header').length,
  footer: document.querySelectorAll('footer').length,
  h1: document.querySelectorAll('h1').length,
  headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName),
}))()`);
const jumps = a11y.headings.reduce((acc, tag, i, arr) => {
  if (i === 0) return acc;
  const prev = Number(arr[i - 1][1]), cur = Number(tag[1]);
  return cur - prev > 1 ? acc + 1 : acc;
}, 0);
check("exactly one h1", a11y.h1 === 1, `h1=${a11y.h1}`);
check("landmarks present", a11y.main === 1 && a11y.header === 1 && a11y.footer === 1,
  `main=${a11y.main} header=${a11y.header} footer=${a11y.footer}`);
check("no skipped heading levels", jumps === 0, `${jumps} jumps in ${a11y.headings.length} headings`);

// ---- 7. Fonts actually loaded (self-hosted, no external requests) ----
const fonts = await evalJs(`document.fonts.ready.then(() => [...document.fonts].map(f => f.family).filter((v,i,a)=>a.indexOf(v)===i))`);
check("both webfonts loaded", Array.isArray(fonts) && fonts.some(f => /Newsreader/i.test(f)) && fonts.some(f => /Plex Mono/i.test(f)), JSON.stringify(fonts));

// ---- 8. WCAG AA contrast for every tone that carries text, both themes ----
const contrast = await evalJs(`(() => {
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (rgb) => { const [r,g,b] = rgb; return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b); };
  const parse = (s) => s.match(/\\d+/g).slice(0,3).map(Number);
  const ratio = (a, b) => { const la = lum(parse(a)), lb = lum(parse(b));
    const hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };
  const cs = getComputedStyle(document.documentElement);
  const tok = (n) => cs.getPropertyValue(n).trim();
  const toRgb = (hex) => { const h = hex.replace('#',''); return 'rgb(' +
    [0,2,4].map(i => parseInt(h.slice(i,i+2),16)).join(',') + ')'; };
  const paper = toRgb(tok('--paper'));
  const out = {};
  for (const t of ['--ink','--ink-muted','--ink-faint','--accent']) {
    out[t] = Number(ratio(toRgb(tok(t)), paper).toFixed(2));
  }
  return out;
})()`);
const failing = Object.entries(contrast).filter(([, r]) => r < 4.5);
check(`contrast AA (light theme)`, failing.length === 0, JSON.stringify(contrast));

await evalJs(`document.documentElement.setAttribute('data-theme','dark')`);
await wait(300);
const contrastDark = await evalJs(`(() => {
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (rgb) => { const [r,g,b] = rgb; return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b); };
  const ratio = (a, b) => { const la = lum(a), lb = lum(b);
    const hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };
  const cs = getComputedStyle(document.documentElement);
  const hex = (n) => { const h = cs.getPropertyValue(n).trim().replace('#','');
    return [0,2,4].map(i => parseInt(h.slice(i,i+2),16)); };
  const paper = hex('--paper');
  const out = {};
  for (const t of ['--ink','--ink-muted','--ink-faint','--accent']) {
    out[t] = Number(ratio(hex(t), paper).toFixed(2));
  }
  return out;
})()`);
const failingDark = Object.entries(contrastDark).filter(([, r]) => r < 4.5);
check(`contrast AA (dark theme)`, failingDark.length === 0, JSON.stringify(contrastDark));

// ---- 9. Diagrams must be accessible, not decorative ----
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://localhost:3000" });
await wait(2200);
const svgs = await evalJs(`(() => {
  const all = [...document.querySelectorAll('svg[role="img"]')];
  const bad = [];
  for (const svg of all) {
    const ids = (svg.getAttribute('aria-labelledby') || '').split(/\\s+/).filter(Boolean);
    const texts = ids.map(id => (svg.querySelector('#' + CSS.escape(id))?.textContent || '').trim());
    if (ids.length < 2 || texts.some(t => t.length < 10)) {
      bad.push(svg.querySelector('title')?.textContent?.slice(0,40) || 'untitled');
    }
  }
  return { total: all.length, bad };
})()`);
check("every diagram has a title + desc", svgs.total >= 2 && svgs.bad.length === 0,
  `${svgs.total} diagrams${svgs.bad.length ? ", bad: " + JSON.stringify(svgs.bad) : ""}`);

// Only one variant of each diagram may be exposed at a time.
const visibleSvgs = await evalJs(`[...document.querySelectorAll('svg[role="img"]')]
  .filter(s => s.getBoundingClientRect().width > 0).length`);
check("one diagram variant visible per figure at 1280px", visibleSvgs === 2, `${visibleSvgs} visible`);

// ---- 10. Anchored sections must land below the sticky header, not under it ----
for (const [w, label] of [[390, "mobile"], [1280, "desktop"]]) {
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "light" }, REDUCE],
  });
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: 800, deviceScaleFactor: 1, mobile: w < 500 });
  await send("Page.navigate", { url: "http://localhost:3000" });
  await wait(2800);
  // A real mouse event at the link's coordinates, not el.click() — closer to
  // what a user does, and it doesn't depend on synthetic-click quirks.
  const box = await evalJs(`(() => {
    const link = [...document.querySelectorAll('a[href="#work"]')].find(a => a.getBoundingClientRect().width > 0);
    if (!link) return null;
    const r = link.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  })()`);
  const clicked = box !== null;
  if (clicked) {
    for (const type of ["mousePressed", "mouseReleased"]) {
      await send("Input.dispatchMouseEvent", {
        type, x: box.x, y: box.y, button: "left", clickCount: 1,
      });
    }
  }
  // Smooth-scrolling ~2000px takes well over a second; poll until it settles
  // rather than sampling once, which previously passed without scrolling at all.
  const landed = await waitUntil(
    `(() => {
      const header = document.querySelector('header');
      return {
        headerH: Math.round(header.getBoundingClientRect().height),
        sectionTop: Math.round(document.getElementById('work').getBoundingClientRect().top),
      };
    })()`,
    (v) => v && Math.abs(v.sectionTop - v.headerH) < 60,
    6000,
  );
  check(`#work lands just below the sticky header (${label})`,
    clicked && Math.abs(landed.sectionTop - landed.headerH) < 60,
    !clicked ? "no visible nav link"
      : `header ${landed.headerH}px, section top ${landed.sectionTop}px (gap ${landed.sectionTop - landed.headerH}px)`);
}

// ---- 11. The filter is the replacement for the skills wall — it must work ----
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://localhost:3000" });
await wait(2400);

const filterFlow = await evalJs(`(async () => {
  const items = () => document.querySelectorAll('#work ol > li').length;
  const status = () => document.querySelector('[role=status]')?.textContent || '';
  const chip = (t) => [...document.querySelectorAll('#work button')].find(b => b.textContent.startsWith(t));
  const total = items();

  chip('Kafka').click();
  await new Promise(r => setTimeout(r, 350));
  const filtered = items();
  const filteredStatus = status();
  const pressed = chip('Kafka').getAttribute('aria-pressed');
  const titles = [...document.querySelectorAll('#work ol > li h3')].map(h => h.textContent);

  [...document.querySelectorAll('#work button')].find(b => b.textContent.trim() === 'Everything').click();
  await new Promise(r => setTimeout(r, 350));

  return { total, filtered, filteredStatus, pressed, titles, restored: items() };
})()`);
check("filter narrows the work list", filterFlow.total === 7 && filterFlow.filtered > 0 && filterFlow.filtered < filterFlow.total,
  `${filterFlow.total} → ${filterFlow.filtered} on Kafka (${JSON.stringify(filterFlow.titles)})`);
check("filter sets aria-pressed and announces", filterFlow.pressed === "true" && /1 of 7/.test(filterFlow.filteredStatus),
  `aria-pressed=${filterFlow.pressed}, status "${filterFlow.filteredStatus}"`);
check("clearing the filter restores every item", filterFlow.restored === filterFlow.total,
  `${filterFlow.restored}/${filterFlow.total}`);

// Every chip must lead somewhere — a chip returning nothing is a dead end.
const deadChips = await evalJs(`(() => {
  const labels = [...document.querySelectorAll('#work button')]
    .map(b => b.textContent.trim())
    .filter(t => t !== 'Everything');
  return labels.filter(t => /\\s0$/.test(t));
})()`);
check("no filter chip returns zero results", deadChips.length === 0,
  deadChips.length ? JSON.stringify(deadChips) : "all chips have matches");

// ---- 12. Collapsed cards must still carry the substance ----
const substance = await evalJs(`(() => {
  document.querySelectorAll('details').forEach(d => { d.open = false; });
  const cards = [...document.querySelectorAll('#work ol > li')];
  const thin = cards.filter(li => {
    const h3 = li.querySelector('h3');
    const tech = li.querySelectorAll('ul li').length;
    const words = (li.textContent || '').trim().split(/\\s+/).length;
    return !h3 || !h3.textContent.trim() || tech === 0 || words < 25;
  }).map(li => li.id || 'unknown');
  return { cards: cards.length, thin };
})()`);
check("every collapsed card still shows title, headline and stack",
  substance.cards === 7 && substance.thin.length === 0,
  `${substance.cards} cards${substance.thin.length ? ", thin: " + JSON.stringify(substance.thin) : ""}`);

// ---- 13. Disclosures are keyboard-operable ----
const kbd = await evalJs(`(() => {
  const d = document.querySelector('#work details');
  d.open = false;
  d.querySelector('summary').focus();
  return document.activeElement.tagName === 'SUMMARY';
})()`);
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, text: "\r" });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
await wait(350);
const opened = await evalJs(`document.querySelector('#work details').open`);
// Asserted independently of the keyboard toggle above: open it directly, then
// poll. One behaviour per check — coupling the two made this read mid-transition.
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-color-scheme", value: "light" }, REDUCE],
});
await freezeTransitions();
await evalJs(`document.querySelector('#work details').open = true`);
const caret = await waitUntil(
  `getComputedStyle(document.querySelector('#work details .disclosure-caret')).transform`,
  (v) => typeof v === "string" && v.startsWith("matrix") && v !== "matrix(1, 0, 0, 1, 0, 0)",
);
check("summary is focusable and Enter toggles it", kbd === true && opened === true,
  `focusable=${kbd}, open=${opened}`);
check("caret rotates when open",
  typeof caret === "string" && caret.startsWith("matrix") && caret !== "matrix(1, 0, 0, 1, 0, 0)",
  String(caret));

// ---- 14. Career strip lays out without its own scroll region ----
const strip = await evalJs(`(() => {
  const ol = document.querySelector('#career ol');
  return { stops: ol.children.length, overflows: ol.scrollWidth > ol.clientWidth + 1 };
})()`);
check("career strip fits without scrolling", strip.stops === 4 && !strip.overflows,
  `${strip.stops} stops, overflows=${strip.overflows}`);

console.log("\n" + results.join("\n"));
const failed = results.filter((r) => r.startsWith("FAIL")).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
ws.close(); chrome.kill();
process.exit(failed ? 1 : 0);

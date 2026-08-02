/**
 * Architecture diagrams, drawn in the page's own language: hairline strokes, no
 * fills, no radius, mono labels, accent reserved for the path data travels.
 *
 * Three rules these must keep:
 *
 * 1. Nothing invented. The source profile doesn't name the individual services
 *    in the Kafka rebuild, so they stay generic. A diagram is not a licence to
 *    make up detail that isn't on record.
 * 2. Two variants each. A wide viewBox scaled down to a 320px phone renders
 *    11px labels at ~5px. The stacked variant isn't a nicety.
 * 3. The <desc> carries the same information in prose, so the diagram is never
 *    the only place a fact exists.
 */

const STROKE = "var(--rule-strong)";
const TEXT = "var(--ink-muted)";
const FAINT = "var(--ink-faint)";
const ACCENT = "var(--accent)";

/** Hairline box with a centred mono label. */
function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={accent ? ACCENT : STROKE}
        strokeWidth={1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -3 : 4)}
        textAnchor="middle"
        fontSize={11}
        letterSpacing="0.08em"
        fill={accent ? ACCENT : TEXT}
        className="font-mono"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          fontSize={9}
          letterSpacing="0.06em"
          fill={FAINT}
          className="font-mono"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/** Straight connector. `accent` marks the path messages actually travel. */
function Line({
  x1,
  y1,
  x2,
  y2,
  accent = false,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  accent?: boolean;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={accent ? ACCENT : STROKE}
      strokeWidth={1}
      strokeDasharray={dashed ? "3 3" : undefined}
    />
  );
}

function Caption({
  x,
  y,
  children,
  anchor = "middle",
  accent = false,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  accent?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={9.5}
      letterSpacing="0.14em"
      fill={accent ? ACCENT : FAINT}
      className="font-mono"
    >
      {children.toUpperCase()}
    </text>
  );
}

function Frame({
  viewBox,
  titleId,
  descId,
  title,
  desc,
  className,
  children,
}: {
  viewBox: string;
  titleId: string;
  descId: string;
  title: string;
  desc: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      viewBox={viewBox}
      className={`h-auto w-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{desc}</desc>
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------

const KAFKA_TITLE = "Monolith to Kafka services, before and after";
const KAFKA_DESC =
  "Before: a single standalone Java application processed a queue end to end, taking 20 minutes. After: the application was split into multiple services that communicate over Kafka, bringing the same queued message processing down to 5 minutes — a 75% reduction.";

/** The decomposition the hero's central claim rests on. */
export function KafkaRebuild() {
  const services = [0, 1, 2];

  return (
    <figure className="mt-8 border-t border-rule pt-7">
      {/* Wide: before and after side by side, so the change is a comparison. */}
      <Frame
        viewBox="0 0 620 178"
        titleId="kafka-t"
        descId="kafka-d"
        title={KAFKA_TITLE}
        desc={KAFKA_DESC}
        className="hidden sm:block"
      >
        <Caption x={0} y={12} anchor="start">
          Before
        </Caption>
        <Node x={0} y={64} w={190} h={72} label="standalone java app" />
        <Caption x={95} y={166}>
          20 min per queue
        </Caption>

        <Line x1={214} y1={100} x2={266} y2={100} />
        <path d="M266 100 l-7 -3.5 v7 z" fill={STROKE} />

        <Caption x={290} y={12} anchor="start">
          After
        </Caption>
        {services.map((i) => {
          const y = 52 + i * 42;
          return (
            <g key={i}>
              <Node x={290} y={y} w={118} h={30} label="service" />
              <Line x1={408} y1={y + 15} x2={452} y2={100} accent />
            </g>
          );
        })}
        <Node x={452} y={82} w={104} h={36} label="kafka" accent />
        <Caption x={504} y={148} accent>
          5 min per queue
        </Caption>
      </Frame>

      {/* Narrow: stacked, because a 620-wide viewBox on a phone is unreadable. */}
      <Frame
        viewBox="0 0 300 300"
        titleId="kafka-mt"
        descId="kafka-md"
        title={KAFKA_TITLE}
        desc={KAFKA_DESC}
        className="sm:hidden"
      >
        <Caption x={0} y={11} anchor="start">
          Before
        </Caption>
        <Node x={0} y={24} w={300} h={54} label="standalone java app" />
        <Caption x={150} y={96}>
          20 min per queue
        </Caption>

        <Line x1={150} y1={110} x2={150} y2={134} dashed />

        <Caption x={0} y={156} anchor="start">
          After
        </Caption>
        {services.map((i) => (
          <g key={i}>
            <Node x={0} y={170 + i * 38} w={128} h={28} label="service" />
            <Line
              x1={128}
              y1={184 + i * 38}
              x2={186}
              y2={222}
              accent
            />
          </g>
        ))}
        <Node x={186} y={204} w={114} h={36} label="kafka" accent />
        <Caption x={243} y={266} accent>
          5 min per queue
        </Caption>
      </Frame>

      <figcaption className="label mt-5 text-ink-faint">
        Queued message processing, before and after the rebuild — 75% faster
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------------------

const CS30_TITLE = "CS30 Secure Coding Lab system architecture";
const CS30_DESC =
  "A Kotlin Multiplatform and Compose frontend, running on desktop and in the browser via wasmJs, talks to two backends: a Spring Boot service handling Google OAuth, problem delivery, and git-backed autosave; and a Python FastAPI judge that runs student submissions inside Docker sandboxes.";

/** The featured project is a three-service system; prose alone hides that. */
export function Cs30System() {
  return (
    <figure className="mt-8 border-t border-rule pt-7">
      <Frame
        viewBox="0 0 620 176"
        titleId="cs30-t"
        descId="cs30-d"
        title={CS30_TITLE}
        desc={CS30_DESC}
        className="hidden sm:block"
      >
        <Caption x={0} y={12} anchor="start">
          Client
        </Caption>
        <Node
          x={0}
          y={62}
          w={176}
          h={62}
          label="compose ui"
          sub="desktop + wasmjs"
          accent
        />

        <Line x1={176} y1={93} x2={232} y2={54} accent />
        <Line x1={176} y1={93} x2={232} y2={140} accent />

        <Caption x={232} y={12} anchor="start">
          Services
        </Caption>
        <Node
          x={232}
          y={30}
          w={196}
          h={50}
          label="spring boot"
          sub="oauth · problems · autosave"
        />
        <Node
          x={232}
          y={116}
          w={196}
          h={50}
          label="fastapi judge"
          sub="runs submissions"
        />

        <Line x1={428} y1={55} x2={486} y2={55} dashed />
        <Node x={486} y={38} w={134} h={34} label="git" />

        <Line x1={428} y1={141} x2={486} y2={141} dashed />
        <Node x={486} y={124} w={134} h={34} label="docker sandbox" />
      </Frame>

      <Frame
        viewBox="0 0 300 340"
        titleId="cs30-mt"
        descId="cs30-md"
        title={CS30_TITLE}
        desc={CS30_DESC}
        className="sm:hidden"
      >
        <Node
          x={0}
          y={0}
          w={300}
          h={56}
          label="compose ui"
          sub="desktop + wasmjs"
          accent
        />
        <Line x1={150} y1={56} x2={150} y2={86} accent />

        <Node
          x={0}
          y={86}
          w={300}
          h={54}
          label="spring boot"
          sub="oauth · problems · autosave"
        />
        <Line x1={150} y1={140} x2={150} y2={166} dashed />
        <Node x={60} y={166} w={180} h={32} label="git" />

        <Line x1={150} y1={198} x2={150} y2={228} accent />
        <Node
          x={0}
          y={228}
          w={300}
          h={54}
          label="fastapi judge"
          sub="runs submissions"
        />
        <Line x1={150} y1={282} x2={150} y2={306} dashed />
        <Node x={60} y={306} w={180} h={32} label="docker sandbox" />
      </Frame>

      <figcaption className="label mt-5 text-ink-faint">
        One Compose codebase on desktop and web, two backends behind it
      </figcaption>
    </figure>
  );
}

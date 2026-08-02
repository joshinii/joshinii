/**
 * Single source of truth for everything on this site.
 *
 * Transcribed from:
 *   /Users/spartan/Projects/tailored-resume-system/user_data/structured_profile.yaml
 *
 * When the YAML changes, re-sync this file by hand. Nothing here is parsed or
 * fetched at build time — the site has no runtime dependency on that directory.
 *
 * Note the shape: jobs and side projects live in ONE `work` array, titled by
 * what was built rather than by who paid for it. That's the deliberate break
 * from résumé structure — see README.
 */

export type Link = {
  label: string;
  href: string;
};

/** A number worth pulling out of the prose. */
export type Metric = {
  value: string;
  label: string;
};

export type WorkItem = {
  /** Also the anchor id, as `work-<id>` — the focus cards link to these. */
  id: string;
  kind: "role" | "project";
  /** The work itself. Never the employer — that's `org`. */
  title: string;
  org?: string;
  /** Job title, for roles. */
  role?: string;
  context?: string;
  start: string;
  end: string;
  /** `null` means ongoing. */
  endYear: number | null;
  /** One line. The whole point of the item, for someone who reads nothing else. */
  headline: string;
  result?: Metric;
  /** Displayed in full, always. Precise names. */
  tech: string[];
  /**
   * Normalised tags the filter matches on — deliberately separate from `tech`.
   * An item using Lambda, S3 and SQS should answer to the "AWS" chip, and
   * substring matching on `tech` would not reliably do that.
   */
  topics: string[];
  /** The bullets. Collapsed behind the expander; never load-bearing. */
  detail: string[];
  diagram?: "kafka" | "cs30";
  links: Link[];
};

export type Study = {
  institution: string;
  location: string;
  degree: string;
  field: string;
  /**
   * Only the end date is on record. The source profile gives no program start
   * dates and a plausible guess on a résumé site is a liability.
   */
  end: string;
  endYear: number | null;
  gpa: string;
  honors?: string;
  current?: boolean;
};

export type Certification = {
  name: string;
  issued: string;
  /** Present only where the credential has lapsed. */
  expired?: string;
};

// ---------------------------------------------------------------------------

export const contact = {
  name: "Joshini Meenakshisundaram Naagraj",
  shortName: "Joshini M. N.",
  role: "Backend Software Engineer",
  location: "San Jose, California",
  email: "joshini.mn@gmail.com",
  linkedin: "https://www.linkedin.com/in/joshini-m-n/",
  linkedinLabel: "linkedin.com/in/joshini-m-n",
  /**
   * Not in the source YAML — supply the handle to switch the header/footer
   * GitHub links on. Every consumer checks for null, so the site renders
   * correctly while this is unset.
   */
  github: null as string | null,
  githubLabel: null as string | null,
  resume: "/Joshini_Meenakshisundaram_Naagraj_Resume.pdf",
} as const;

/** The hero thesis. First person, not resume voice. */
export const positioning =
  "I take backend systems that do one thing slowly and rebuild them to do many things fast.";

/**
 * The four questions a recruiter screens on, answered above the fold. Kept in
 * the mono label voice rather than a stat-tile row — this is a specification,
 * not marketing.
 */
export const heroFacts: { term: string; detail: string }[] = [
  { term: "Experience", detail: "7 years — Java, Spring Boot, distributed systems" },
  { term: "Focus", detail: "Backend services · Kafka · REST APIs · AWS" },
  { term: "Studying", detail: "M.S. Software Engineering, SJSU — May 2027" },
  { term: "Available", detail: "Internships now · Full-time May 2027" },
];

/** All that survives of the old two-paragraph About. The best line, kept. */
export const intro =
  "Seven years in the part of the stack where throughput, correctness, and 2 a.m. pages live — now doing an M.S. at San José State and building the things I used to only maintain.";

/**
 * What kind of engineer she is, answered in three cards. Each proof anchors
 * into the work item that backs it, so the cards double as navigation.
 */
export const focusAreas: {
  title: string;
  body: string;
  proof: Link;
}[] = [
  {
    title: "Decompose monoliths",
    body: "Find the seams in an application that grew too big, and split it into services that talk over a queue.",
    proof: { label: "20 min → 5 min", href: "#work-kafka" },
  },
  {
    title: "Build and operate services",
    body: "REST APIs with authentication and authorization, production debugging, and the tests and dashboards that keep them honest.",
    proof: { label: "200+ tests written", href: "#work-accenture" },
  },
  {
    title: "Ship infrastructure as code",
    body: "Serverless architectures described entirely in Terraform and deployed through CI/CD.",
    proof: { label: "5+ AWS services in IaC", href: "#work-serverless" },
  },
];

/**
 * Ordered by strength, not by date — every card carries its own dates, and the
 * career strip carries the arc. Reverse chronology is the résumé's idea, and
 * it buries the two most interesting things.
 */
export const work: WorkItem[] = [
  {
    id: "cs30",
    kind: "project",
    title: "CS30 Secure Coding Lab",
    org: "San José State University",
    context: "with Prof. Ben Reed",
    start: "Apr 2026",
    end: "Present",
    endYear: null,
    headline:
      "A greenfield secure coding lab SJSU students will use live next semester. I own the frontend end to end and shaped the design from the first brainstorming session.",
    tech: [
      "Kotlin Multiplatform",
      "Compose",
      "wasmJs",
      "Spring Boot",
      "Google OAuth",
      "Python",
      "FastAPI",
      "Docker",
    ],
    topics: ["Kotlin", "Spring Boot", "Python", "Docker"],
    detail: [
      "Built the entire frontend in Kotlin Multiplatform + Compose, targeting both desktop and browser from one codebase.",
      "Wired it to a Spring Boot service handling Google OAuth, problem delivery, and git-backed autosave, plus a Python/FastAPI judge that runs student submissions in Docker sandboxes.",
      "Wrote the code editor itself — syntax highlighting, auto-indent, and copy-paste controls.",
      "Built the exam lockdown system: activity logging, a violations banner, and fullscreen enforcement.",
      "Added wasmJs web support and shipped performance work — gzip and cache-control tuning.",
    ],
    diagram: "cs30",
    links: [],
  },
  {
    id: "kafka",
    kind: "role",
    title: "Monolith → Kafka services",
    org: "LTIMindtree",
    role: "Specialist Software Engineer",
    context: "India",
    start: "Nov 2022",
    end: "Aug 2024",
    endYear: 2024,
    headline:
      "Split a standalone Java application into services communicating over Kafka, configuring the broker by hand, and cut end-to-end queue latency by 75%.",
    result: { value: "20 min → 5 min", label: "queued message processing" },
    tech: ["Java", "Spring Boot", "Kafka", "REST APIs", "Angular", "Jenkins", "OpenShift"],
    topics: ["Java", "Spring Boot", "Kafka", "REST APIs", "Microservices", "Angular"],
    detail: [
      "Converted a standalone Java application into multiple microservices communicating over Kafka, doing the Kafka configuration for the new service by hand.",
      "Designed and implemented REST APIs with authentication and authorization for high-volume transaction processing.",
      "Debugged and resolved 100+ production issues with full test coverage, and ran Jenkins CI/CD pipelines alongside OpenShift pod operations.",
      "Converted legacy MVC screens to Angular for a banking application, delivering two full screen conversions as a full-stack individual contributor.",
    ],
    diagram: "kafka",
    links: [],
  },
  {
    id: "serverless",
    kind: "project",
    title: "Serverless Sentiment Analysis",
    start: "Dec 2025",
    end: "Dec 2025",
    endYear: 2025,
    headline:
      "A DistilBERT sentiment platform with no servers to keep alive — real-time and batch inference, the whole stack described in Terraform.",
    result: { value: "5+", label: "AWS services, all in IaC" },
    tech: [
      "DistilBERT",
      "ONNX Runtime",
      "AWS Lambda",
      "API Gateway",
      "DynamoDB",
      "S3",
      "SQS",
      "Terraform",
    ],
    topics: ["AWS", "Terraform", "Python"],
    detail: [
      "Deployed a serverless architecture across Lambda, API Gateway, DynamoDB, S3, and SQS, provisioned entirely through Terraform.",
      "Optimized inference with ONNX Runtime so the model runs efficiently on CPU inside a Lambda's constraints.",
      "Automated model export, infrastructure provisioning, and deployment with GitHub Actions.",
    ],
    links: [],
  },
  {
    id: "llm-monitoring",
    kind: "project",
    title: "LLM Input Monitoring",
    context: "Sensitive data detection",
    start: "Dec 2025",
    end: "Dec 2025",
    endYear: 2025,
    headline:
      "A browser extension and backend service that watch what you paste into an LLM and flag sensitive data before it leaves the machine.",
    tech: ["Browser Extension", "Python", "LLM Inference", "Local-first"],
    topics: ["Python"],
    detail: [
      "Captured and analyzed user input from LLM applications in real time via a browser extension and companion backend.",
      "Used LLM-based detection to flag sensitive information mid-prompt, before submission.",
      "Kept the whole pipeline local — no analysis leaves the device, which is the only way a tool like this is trustworthy.",
    ],
    links: [],
  },
  {
    id: "accenture",
    kind: "role",
    title: "Enterprise backend across four databases",
    org: "Accenture",
    role: "Application Development Senior Analyst",
    context: "India",
    start: "Jan 2020",
    end: "Nov 2022",
    endYear: 2022,
    headline:
      "Java services over Oracle, MongoDB, Postgres and IBM DB2, running on Azure and watched through Splunk and Dynatrace.",
    result: { value: "200+", label: "unit tests written" },
    tech: [
      "Java",
      "Oracle SQL",
      "MongoDB",
      "Postgres",
      "IBM DB2",
      "Azure",
      "Splunk",
      "Dynatrace",
      "Angular",
    ],
    topics: ["Java", "SQL", "Microservices", "Angular"],
    detail: [
      "Built and maintained backend services in Java and Oracle SQL inside a microservices architecture, contributing to modular and scalable system design.",
      "Wrote and analyzed queries across MongoDB, Postgres, and IBM DB2 for enterprise application data.",
      "Monitored cloud applications on Azure using Splunk dashboards and Dynatrace for log analysis and performance work.",
      "Wrote 200+ unit tests in JUnit and Jasmine, plus functional and integration testing across backend, frontend, and database layers.",
      "Worked across the stack as a senior contributor — modernized legacy GWT screens to Angular, ran sprint planning for the team, and delivered 2–3 stories per sprint end to end.",
    ],
    links: [],
  },
  {
    id: "census",
    kind: "project",
    title: "Essential Workers Mental Health",
    context: "Columbia University · CIC Student Paper Challenge",
    start: "Sep 2025",
    end: "Sep 2025",
    endYear: 2025,
    headline:
      "A statistical study of mental health outcomes among U.S. essential workers, built on census microdata.",
    result: { value: "60K+", label: "census records analyzed" },
    tech: ["Python", "Pandas", "NumPy", "SciPy"],
    topics: ["Python"],
    detail: [
      "Analyzed 60,000+ U.S. Census records with Pandas, NumPy, and SciPy.",
      "Built the pipeline for cleaning, feature engineering, and statistical analysis.",
      "Identified statistically significant mental health trends across worker cohorts.",
    ],
    links: [],
  },
  {
    id: "infosys",
    kind: "role",
    title: "Java messaging integrations",
    org: "Infosys",
    role: "Senior System Engineer",
    context: "India",
    start: "Jan 2017",
    end: "May 2019",
    endYear: 2019,
    headline:
      "Backend systems on JMS and JAXB, keeping service-to-service integration reliable across an enterprise estate.",
    tech: ["Java", "JMS", "JAXB", "SQL", "MySQL", "AngularJS"],
    topics: ["Java", "SQL"],
    detail: [
      "Built Java backend systems on messaging frameworks — JMS and JAXB — for reliable service-to-service integration.",
      "Wrote maintainable, secure code to standard design practices, and handled production support and issue resolution.",
      "Built early foundations in Java, MySQL, Python, and AngularJS.",
    ],
    links: [],
  },
];

/**
 * The filter chips, in the order they appear. Every one must match at least one
 * item's `topics` — a chip that returns nothing is a dead end.
 */
export const filterTopics = [
  "Java",
  "Spring Boot",
  "Kafka",
  "Microservices",
  "REST APIs",
  "SQL",
  "AWS",
  "Terraform",
  "Python",
  "Kotlin",
  "Docker",
  "Angular",
];

/** The long tail, so nothing from the source profile is lost to the filter. */
export const alsoWorkedWith = [
  "TypeScript",
  "C",
  "MySQL",
  "Oracle",
  "Postgres",
  "MongoDB",
  "IBM DB2",
  "DynamoDB",
  "Azure",
  "Jenkins",
  "OpenShift",
  "CI/CD",
  "FastAPI",
  "JMS",
  "Compose Multiplatform",
  "wasmJs",
  "Splunk",
  "Dynatrace",
  "JUnit",
  "Jasmine",
  "Postman",
  "Linux",
  "Git",
  "Jira",
  "Confluence",
  "Agile / Scrum",
];

/**
 * The arc, which an impact-ordered work list no longer implies. Evenly spaced —
 * a sequence indicator, not a time-scale chart. `dates` is a literal string
 * because the M.S. has no start date on record.
 */
export const career: { org: string; title: string; dates: string; current?: boolean }[] = [
  { org: "Infosys", title: "Senior System Engineer", dates: "2017 — 2019" },
  { org: "Accenture", title: "App Development Senior Analyst", dates: "2020 — 2022" },
  { org: "LTIMindtree", title: "Specialist Software Engineer", dates: "2022 — 2024" },
  {
    org: "San José State University",
    title: "M.S. Software Engineering",
    dates: "→ May 2027",
    current: true,
  },
];

export const education: Study[] = [
  {
    institution: "San José State University",
    location: "San José, CA",
    degree: "M.S.",
    field: "Software Engineering",
    end: "May 2027",
    endYear: null,
    gpa: "3.9 / 4.0",
    honors: "Phi Kappa Phi Honor Society",
    current: true,
  },
  {
    institution: "Anna University",
    location: "Chennai, India",
    degree: "B.E.",
    field: "Electronics and Instrumentation Engineering",
    end: "Apr 2016",
    endYear: 2016,
    gpa: "3.21 / 4.0",
  },
];

export const certifications: Certification[] = [
  { name: "AWS Solutions Architect – Associate", issued: "Jan 2026" },
  { name: "Oracle Certified Associate, Java SE 8", issued: "Feb 2023" },
  { name: "AWS Certified Developer – Associate", issued: "Aug 2020", expired: "Aug 2021" },
];

export const activities = [
  {
    role: "Volunteer Mentor",
    organization: "Develop for Good",
    start: "May 2025",
    end: "Aug 2025",
    detail:
      "Mentored student teams building web projects, guiding architecture, implementation, and delivery.",
  },
];

export const sections = [
  { id: "focus", label: "Focus" },
  { id: "work", label: "Work" },
  { id: "career", label: "Career" },
  { id: "background", label: "Background" },
  { id: "contact", label: "Contact" },
] as const;

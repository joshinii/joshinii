import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import { contact, positioning } from "@/content/profile";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joshini.vercel.app";
const description =
  "Backend software engineer with seven years in Java, Spring Boot, and distributed systems. Currently an M.S. Software Engineering candidate at San José State University.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${contact.name} — ${contact.role}`,
    template: `%s — ${contact.name}`,
  },
  description,
  keywords: [
    "backend engineer",
    "Java",
    "Spring Boot",
    "Kafka",
    "microservices",
    "AWS",
    "San Jose",
    "software engineer portfolio",
  ],
  authors: [{ name: contact.name }],
  creator: contact.name,
  openGraph: {
    type: "profile",
    title: `${contact.name} — ${contact.role}`,
    description: positioning,
    url: siteUrl,
    siteName: contact.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${contact.name} — ${contact.role}`,
    description: positioning,
  },
  robots: { index: true, follow: true },
};

/**
 * Applies the stored theme before first paint. Blocking in <head> on purpose —
 * deferring it would show a flash of the wrong palette.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: contact.name,
  alternateName: contact.shortName,
  jobTitle: contact.role,
  email: `mailto:${contact.email}`,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "San José",
    addressRegion: "CA",
    addressCountry: "US",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "San José State University" },
    { "@type": "CollegeOrUniversity", name: "Anna University" },
  ],
  knowsAbout: [
    "Java",
    "Spring Boot",
    "Apache Kafka",
    "Microservices",
    "REST APIs",
    "AWS",
    "Terraform",
  ],
  sameAs: [contact.linkedin, ...(contact.github ? [contact.github] : [])],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* Reveals are driven by an observer; without JS they must start visible. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body
        className={`${newsreader.variable} ${plexMono.variable} flex min-h-full flex-col`}
      >
        <a
          href="#about"
          className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

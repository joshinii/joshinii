import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Career from "@/components/Career";
import Focus from "@/components/Focus";
import Work from "@/components/Work";
import Background from "@/components/Background";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Reading order: context, then capability, then proof.
 *
 * Career sits directly under the hero as the overview — a reader gets the whole
 * trajectory in one glance before meeting any detail. Focus then says what she
 * does, and Work supplies the evidence.
 *
 * Sections are full-bleed so each can carry its own background tone, and each
 * applies the max-width container itself (see components/Section.tsx).
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Career />
        <Focus />
        <Work />
        <Background />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

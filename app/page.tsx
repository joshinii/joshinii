import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Focus from "@/components/Focus";
import Work from "@/components/Work";
import Career from "@/components/Career";
import Background from "@/components/Background";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Spine from "@/components/Spine";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 sm:px-8">
        <Hero />
        {/*
          The rail is absolute inside this wrapper, so it spans the body of the
          page — hero above it, footer below.
        */}
        <div className="relative">
          <Spine />
          <Focus />
          <Work />
          <Career />
          <Background />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}

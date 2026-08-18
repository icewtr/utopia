"use client";

import Image from "next/image";
import { Jacques_Francois } from "next/font/google";
import { useEffect, useState } from "react";
import landingBg from "@/src/images/LANDING_BG.png";
import WhatIsSection from "./components/WhatIsSection";
import ThreeSteps from "./components/ThreeSteps";
import FAQ from "./components/FAQ";

const jacquesFrancois = Jacques_Francois({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={jacquesFrancois.className}>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          showHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex w-full items-center justify-between border-b border-white/10 bg-[#2a1535]/60 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <span className="text-2xl tracking-[0.18em] text-white sm:text-3xl lg:text-4xl">
              UTOPIA
            </span>

            <a
              href="https://rsvp.hackclub.community/utopia"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:px-5 sm:text-base"
            >
              RSVP!
            </a>
          </div>

          <img
            src="https://assets.hackclub.com/flag-standalone-bw.svg"
            alt="Hack Club flag"
            className="h-10 w-10 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
          />
        </div>
      </header>

      <section className="relative min-h-screen overflow-hidden text-white">
        <Image
          src={landingBg}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div
          className="pointer-events-none absolute inset-0 backdrop-blur-2xl"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, black 0%, rgba(0,0,0,0.85) 25%, transparent 55%)",
            maskImage:
              "linear-gradient(to right, black 0%, rgba(0,0,0,0.85) 25%, transparent 55%)",
          }}
        />

        <main className="relative z-10 flex min-h-screen flex-col pt-20 pl-16 sm:pl-20 md:pl-24 pt-[12%]">
          <div className="w-fit max-w-xl">
            <h1 className="text-9xl leading-none tracking-wide sm:text-6xl md:text-9xl xs:text-5xl">
              UTOPIA
            </h1>

            <div className="mt-2 ml-2 text-md tracking-widest sm:text-base">
              <span>DALLAS, TX • JAN 14–17</span>
            </div>

            <p className="mt-[12%] max-w-md text-lg leading-relaxed sm:text-xl">
              Design or build 30 hours of wearable tech, then attend a 4-day
              Hackathon in Dallas, TX.
            </p>

            <a
              href="https://rsvp.hackclub.community/utopia"
              className="mt-10 inline-flex w-full max-w-xs items-center justify-center rounded-full bg-black/50 px-10 py-4 text-lg backdrop-blur-md transition-colors hover:bg-black/60 sm:max-w-sm"
            >
              RSVP Here!
            </a>
          </div>
        </main>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#2a1535]"></div>
      </section>

      <WhatIsSection />
      <ThreeSteps />
      <FAQ />
    </div>
  );
}

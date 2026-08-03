import Image from "next/image";
import { Jacques_Francois } from "next/font/google";
import landingBg from "@/src/images/LANDING_BG.jpg";

const jacquesFrancois = Jacques_Francois({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${jacquesFrancois.className} relative min-h-screen overflow-hidden text-white`}
    >
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

      <main className="relative z-10 flex min-h-screen flex-col pt-20 pl-16 sm:pl-20 md:pl-24">
        <div className="w-fit max-w-xl">
          <h1 className="text-6xl leading-none tracking-wide sm:text-7xl md:text-8xl mt-50">
            UTOPIA
          </h1>

          <div className="mt-2 flex w-full justify-between text-sm tracking-widest sm:text-base mb-30">
            <span>DALLAS, TX  •  JAN 14–17</span>
          </div>

          <p className="mt-10 max-w-md text-lg leading-relaxed sm:text-xl">
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
    </div>
  );
}

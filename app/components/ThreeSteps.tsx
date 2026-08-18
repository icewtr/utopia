import { Inter, Jacques_Francois } from "next/font/google";
import eventImage from "@/src/images/EVENT.jpg";
import buildImage from "@/src/images/BUILD.png";
import designImage from "@/src/images/DESIGN.jpg";
import StepCard from "./StepCard";

const jacquesFrancois = Jacques_Francois({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["500", "600"],
  subsets: ["latin"],
});

export default function ThreeSteps() {
  return (
    <section className={`${jacquesFrancois.className} bg-utopia-plum px-6 py-20 sm:px-10 sm:py-24 lg:px-16`}>
      <div className="mx-auto max-w-7xl">
        <span
          className={`${inter.className} text-sm font-medium tracking-[0.25em] text-utopia-caption sm:text-base`}
        >
          THE
        </span>

        <h2 className="mt-1 text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
          Three Steps
        </h2>

        <p className={`${jacquesFrancois.className} mt-6 text-lg italic text-utopia-highlight sm:text-xl`}>
          &quot;I&apos;m interested!!! How do I do this?&quot;
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StepCard
            step="STEP ONE"
            title="Design"
            description="Design to your heart's content, whether it be through custom builds, circuitry, or coding!"
            caption="There are no limits to what you can do, just be creative!"
            polaroidGradient="from-[#7c3aed]/70 via-[#db2777]/60 to-[#f97316]/70"
            polaroidImage={designImage}
          />

          <StepCard
            step="STEP TWO"
            title="Build it"
            description="You can get funded up to TWO HUNDRED DOLLARS to build your cool project!"
            caption="The ES-01, a cool smart watch designed by a hack clubber!"
            polaroidGradient="from-[#6d28d9]/70 via-[#be185d]/60 to-[#ea580c]/70"
            polaroidImage={buildImage}
          />

          <StepCard
            step="STEP THREE"
            title="Go to Utopia"
            description="Get invited to a 4 day hardware hackathon in Dallas, TX"
            caption="teens at San Francisco for Outpost!"
            polaroidGradient="from-[#5b21b6]/70 via-[#9d174d]/60 to-[#c2410c]/70"
            polaroidImage={eventImage}
          />
        </div>
      </div>
    </section>
  );
}

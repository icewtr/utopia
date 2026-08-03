import { Inter, Jacques_Francois } from "next/font/google";

const jacquesFrancois = Jacques_Francois({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["500", "600"],
  subsets: ["latin"],
});

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className={` px-1 text-utopia-highlight`}>{children}</span>
  );
}

function Intertext ({children}: {children: React.ReactNode}) {
  return (
    <span className={`${inter.className}`}>{children}</span>
  )
}

const polaroids = [
  {
    rotate: "-rotate-6",
    offset: "left-0 top-6",
    gradient: "from-[#7c3aed]/70 via-[#db2777]/60 to-[#f97316]/70",
  },
  {
    rotate: "rotate-3",
    offset: "left-8 top-2",
    gradient: "from-[#6d28d9]/70 via-[#be185d]/60 to-[#ea580c]/70",
  },
  {
    rotate: "-rotate-2",
    offset: "left-16 top-0",
    gradient: "from-[#5b21b6]/70 via-[#9d174d]/60 to-[#c2410c]/70",
  },
];

export default function WhatIsSection() {
  return (
    <section className={`${jacquesFrancois.className} bg-utopia-plum px-6 py-20 sm:px-10 sm:py-24 lg:px-16`}>
      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-utopia-plum-light px-8 py-12 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div className="text-white">
              <h2 className="leading-none">
                <span
                  className={`${inter.className} block text-lg font-medium tracking-[0.25em] sm:text-xl`}
                >
                  WHAT IS
                </span>
                <span className="mt-2 block text-5xl sm:text-6xl lg:text-7xl">
                  UTOPIA?
                </span>
              </h2>

              <div className="mt-8 space-y-6 text-base leading-relaxed sm:text-lg">
                <p>
                  Utopia is a program where you design or build cool wearable tech,
                  then attend a {" "}
                  <strong><Highlight>4-day hackathon in Dallas, TX.</Highlight></strong>
                </p>
                <p>
                  You can qualify by completing at least{" "}
                  <strong><Highlight>30 hours of building,</Highlight></strong> with help from the Hack Club community!
                </p>
                <p>
                  You can also get  {""}<strong><Highlight>Cool Prizes</Highlight></strong> and up to {" "}
                  <strong><Highlight>Two Hundred Dollars</Highlight></strong> in funding to build your projects!
                </p>
              </div>
              
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-64 w-full max-w-xs sm:h-72 sm:max-w-sm">
                {polaroids.map((photo, index) => (
                  <div
                    key={index}
                    className={`absolute ${photo.offset} ${photo.rotate} w-44 border-[6px] border-utopia-blush bg-utopia-blush p-1.5 shadow-lg sm:w-52`}
                  >
                    <div
                      className={`aspect-[4/5] bg-gradient-to-br ${photo.gradient}`}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-sm text-utopia-highlight underline decoration-utopia-accent underline-offset-4 sm:text-base">
                <Intertext>teens building cool tech at past hackathons (someone pls add smth)</Intertext>
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${inter.className} relative z-10 -mt-6 mx-4 max-w-md rounded-sm border border-utopia-accent/20 bg-utopia-blush px-6 py-5 text-sm leading-relaxed text-utopia-plum shadow-md sm:mx-8 sm:text-base lg:mx-12`}
        >
          <strong><Highlight> New? Need help? </Highlight></strong> Not to fear! Guides and tutorials available!!!
        </div>
      </div>
    </section>
  );
}

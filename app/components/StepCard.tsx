import Image from "next/image";
import { Inter, Jacques_Francois } from "next/font/google";
import { StaticImageData } from "next/image";

const jacquesFrancois = Jacques_Francois({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["500", "600"],
  subsets: ["latin"],
});

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  polaroidGradient: string;
  polaroidImage?: string | StaticImageData;
}

export default function StepCard({
  step,
  title,
  description,
  polaroidGradient,
  polaroidImage,
}: StepCardProps) {
  return (
    <div className="flex h-[36rem] flex-col rounded-3xl bg-utopia-plum-light px-8 pt-10 sm:px-10 sm:pt-12">
      <span
        className={`${inter.className} text-sm font-medium tracking-[0.25em] text-utopia-cream`}
      >
        {step}
      </span>

      <h3
        className={`${jacquesFrancois.className} mt-2 text-4xl leading-none text-white sm:text-5xl`}
      >
        {title}
      </h3>

      <p
        className={`${inter.className} mt-6 text-base leading-relaxed text-utopia-cream sm:text-lg`}
      >
        {description}
      </p>

      <div className="flex flex-1 items-center justify-center pb-4">
        <div className="w-44 border-[6px] border-utopia-blush bg-utopia-blush p-1.5 shadow-lg sm:w-52">
          {polaroidImage ? (
            <Image
              src={polaroidImage}
              alt={title}
              className="aspect-[4/5] object-cover"
            />
          ) : (
            <div
              className={`aspect-[4/5] bg-gradient-to-br ${polaroidGradient}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

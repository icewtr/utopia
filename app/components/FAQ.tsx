"use client";

import { useState } from "react";
import { Inter, Jacques_Francois } from "next/font/google";

const jacquesFrancois = Jacques_Francois({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["500", "600"],
  subsets: ["latin"],
});

const faqs = [
  {
    question: "I'm 18, can I still participate?",
    answer: "Yes! Hack Club allows you to participate until you turn 19.",
  },
  {
    question: "What is Hack Club?",
    answer: (
      <>
        <a
          href="https://hackclub.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-utopia-accent transition-colors"
        >
          Hack Club
        </a>{" "}
        is the world&apos;s largest community of teenage makers, and a 501(c)(3)
        nonprofit.
      </>
    ),
  },
  {
    question: "What if I can't come to the hackathon?",
    answer: "We'll have a shop where you can buy alternative prizes!",
  },
  {
    question: "I have more questions!",
    answer: "No worries, just join the #utopia channel and ask away!",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-utopia-caption/30 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span
          className={`${inter.className} text-base font-medium text-utopia-cream sm:text-lg`}
        >
          {question}
        </span>
        <span
          className={`${inter.className} shrink-0 text-2xl text-utopia-highlight transition-transform duration-200 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`${inter.className} text-sm leading-relaxed text-utopia-cream/80 sm:text-base`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      className={`${inter.className} bg-utopia-plum px-6 py-20 sm:px-10 sm:py-24 lg:px-16`}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className={`${jacquesFrancois.className} text-5xl font-bold text-white sm:text-6xl lg:text-7xl`}>
          Frequently Asked Questions
        </h2>
        <div className="mt-8 divide-y divide-utopia-caption/30 overflow-hidden rounded-3xl border border-utopia-caption/30 bg-utopia-plum-light px-5 shadow-sm sm:px-6">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

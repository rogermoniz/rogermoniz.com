"use client";

import { useState } from "react";
import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import type { FaqEntry, SectionHeading } from "@/lib/content/types";

/**
 * Single open accordion. The answer animates on grid-template-rows so it
 * expands to its natural height without measuring anything in JavaScript.
 */
export function FaqSection({
  heading,
  entries,
}: {
  heading: SectionHeading;
  entries: readonly FaqEntry[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Container
      as="section"
      id="faq"
      className="bg-surface pt-[clamp(140px,15vw,220px)] pb-[clamp(90px,10vw,140px)]"
    >
      <div className="mx-auto max-w-[900px]">
        <div className="mb-24 text-center">
          <Eyebrow>{heading.eyebrow}</Eyebrow>
          <Reveal variant="text">
            <SectionHeading2>
              {heading.title}
              {heading.subtitle ? <HeadingSub>{heading.subtitle}</HeadingSub> : null}
            </SectionHeading2>
          </Reveal>
        </div>

        <Reveal className="border-t border-edge">
          {entries.map((entry, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={entry.question} className="border-b border-edge">
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between py-10 text-left font-body text-[clamp(1rem,1.5vw,1.5rem)] font-semibold text-ink transition-colors duration-400 ease-out-expo hover:text-accent"
                  >
                    {entry.question}
                    <span
                      aria-hidden="true"
                      className={`inline-block text-3xl font-light transition-[transform,color] duration-600 ease-out-expo ${
                        isOpen ? "rotate-45 text-accent" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className={`grid transition-[grid-template-rows] duration-600 ease-out-expo ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div
                    className={`overflow-hidden text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed text-muted transition-[padding] duration-600 ease-out-expo ${
                      isOpen ? "pb-10" : "pb-0"
                    }`}
                  >
                    <p className="m-0 max-w-[65ch]">{entry.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </Container>
  );
}

import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import type { ProcessStep, SectionHeading } from "@/lib/content/types";

export function ProcessSection({
  heading,
  steps,
}: {
  heading: SectionHeading;
  steps: readonly ProcessStep[];
}) {
  return (
    <section id="process" className="bg-surface py-[var(--band)]">
      <Container>
        <Reveal>
          <Eyebrow>{heading.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal variant="text">
          <SectionHeading2>
            {heading.title}
            {heading.subtitle ? <HeadingSub>{heading.subtitle}</HeadingSub> : null}
          </SectionHeading2>
        </Reveal>

        <div className="mt-10 grid grid-cols-3 gap-[4vw] max-lg:grid-cols-1 max-lg:gap-12">
          {steps.map((step) => (
            <Reveal
              key={step.num}
              // The accent rule grows across the top border on hover.
              className="group relative border-t border-edge pt-8 before:absolute before:top-[-1px] before:left-0 before:h-0.5 before:w-0 before:bg-accent before:transition-[width] before:duration-600 before:ease-out-expo hover:before:w-full"
            >
              <span className="mb-4 block font-body text-sm font-semibold text-accent">
                {step.num}
              </span>
              <h3 className="mb-4 font-display text-[clamp(1.1rem,2.6vw,1.4rem)] font-bold tracking-[-0.02em] text-ink uppercase">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-muted">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

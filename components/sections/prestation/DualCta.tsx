import { Reveal } from "@/components/effects/Reveal";
import { BubbleButton } from "@/components/primitives/BubbleButton";
import {
  Container,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import type { CtaLink } from "@/lib/content/types";

/**
 * The closing call to action. Heading and lead copy are optional, so the same
 * component serves the two pages that show only buttons and the six that
 * introduce them with a paragraph or two.
 */
export function DualCta({
  links,
  heading,
  lead,
}: {
  links: readonly CtaLink[];
  heading?: { title: string; subtitle: string | null };
  lead?: readonly string[];
}) {
  const hasIntro = Boolean(heading) || Boolean(lead?.length);

  return (
    <section id="cta-contact" className="bg-surface py-[clamp(64px,7vw,100px)] text-center">
      <Container>
        {heading ? (
          <Reveal variant="text">
            <SectionHeading2 className="mb-8">
              {heading.title}
              {heading.subtitle ? <HeadingSub>{heading.subtitle}</HeadingSub> : null}
            </SectionHeading2>
          </Reveal>
        ) : null}

        {lead?.length ? (
          <Reveal>
            {lead.map((line, index) => (
              <p
                key={index}
                className={`mx-auto max-w-[70ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed ${
                  index === 0 ? "text-muted" : "mt-6 text-ink"
                }`}
              >
                {line}
              </p>
            ))}
          </Reveal>
        ) : null}

        <div className={`flex flex-wrap justify-center gap-8 max-[600px]:w-full max-[600px]:flex-col ${hasIntro ? "mt-16" : ""}`}>
          {links.map((link) => (
            <BubbleButton key={link.href} href={link.href} variant={link.variant}>
              {link.label}
            </BubbleButton>
          ))}
        </div>
      </Container>
    </section>
  );
}

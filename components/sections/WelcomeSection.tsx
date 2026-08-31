import Image from "next/image";
import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { cloudinary } from "@/lib/cloudinary";
import type { HomePage } from "@/lib/content/types";

export function WelcomeSection({ welcome }: { welcome: HomePage["welcome"] }) {
  return (
    <Container
      as="section"
      id="welcome"
      className="relative z-30 flex min-h-screen items-center bg-surface pt-[var(--band-hero)] pb-[var(--band-loose)]"
    >
      <div className="grid w-full grid-cols-2 items-center gap-20 max-lg:grid-cols-1 max-lg:gap-12">
        <Reveal className="group relative aspect-4/5 w-full overflow-hidden rounded-3xl max-lg:aspect-video">
          <Image
            src={cloudinary(welcome.image.path, { width: 1000 })}
            alt={welcome.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="size-full object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-105"
          />
        </Reveal>

        <div className="flex flex-col justify-center">
          <div>
            <Eyebrow>{welcome.eyebrow}</Eyebrow>
          </div>
          <Reveal variant="text">
            <SectionHeading2>
              {welcome.title}
              <HeadingSub>{welcome.subtitle}</HeadingSub>
            </SectionHeading2>
          </Reveal>
          {welcome.paragraphs.map((paragraph, index) => (
            <Reveal
              key={index}
              variant="text"
              as="p"
              className="mt-8 text-[clamp(1.125rem,1.5vw,1.5rem)] leading-relaxed text-muted transition-colors duration-800 ease-out-expo [&_strong]:font-medium [&_strong]:text-ink"
            >
              <RichText value={paragraph} />
            </Reveal>
          ))}
        </div>
      </div>
    </Container>
  );
}

/**
 * Renders the one piece of inline emphasis the copy uses. Parsing a tiny,
 * closed markup vocabulary into real elements keeps the content as data
 * without ever handing a string to the DOM as HTML.
 */
function RichText({ value }: { value: string }) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

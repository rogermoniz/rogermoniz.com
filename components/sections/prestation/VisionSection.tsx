import Image from "next/image";
import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { cloudinary } from "@/lib/cloudinary";
import type { VisionBlock } from "@/lib/content/types";

const prose =
  "mb-8 max-w-[45ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-relaxed text-muted";

/**
 * Two layouts from one component: prose beside a 2x2 photo grid, or a full
 * width column with the photos stacked between heading and text.
 */
export function VisionSection({ vision }: { vision: VisionBlock }) {
  if (vision.kind === "stacked") {
    return (
      <Container
        as="section"
        id="vision"
        className="relative z-10 bg-surface py-[clamp(64px,7vw,100px)]"
      >
        <div>
          <Reveal>
            <Eyebrow>{vision.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal variant="text">
            <SectionHeading2>{vision.heading}</SectionHeading2>
          </Reveal>
        </div>

        <Reveal className="mt-10 grid grid-cols-3 gap-[clamp(8px,1vw,16px)] max-md:grid-cols-1">
          {vision.images.map((image) => (
            <figure key={image.path} className="group m-0 overflow-hidden rounded-2xl">
              <Image
                src={cloudinary(image.path, { width: 700 })}
                alt={image.alt}
                width={700}
                height={875}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="aspect-4/5 size-full object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-105"
              />
            </figure>
          ))}
        </Reveal>

        <Reveal className="mt-10">
          {vision.paragraphs.map((paragraph, index) => (
            <p key={index} className={prose}>
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Container>
    );
  }

  return (
    <Container
      as="section"
      id="vision"
      className="relative z-10 bg-surface py-[clamp(64px,7vw,100px)]"
    >
      <Reveal>
        <Eyebrow>{vision.eyebrow}</Eyebrow>
      </Reveal>
      <div className="grid grid-cols-2 items-center gap-[6vw] max-lg:grid-cols-1 max-lg:gap-12">
        <Reveal className="flex flex-col">
          <SectionHeading2 className="mb-8">{vision.heading}</SectionHeading2>
          {vision.paragraphs.map((paragraph, index) => (
            <p key={index} className={prose}>
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal className="grid w-full grid-cols-2 gap-[clamp(8px,1vw,16px)]">
          {vision.images.map((image) => (
            <Image
              key={image.path}
              src={cloudinary(image.path, { width: 1000 })}
              alt={image.alt}
              width={1000}
              height={1250}
              loading="lazy"
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="aspect-4/5 size-full rounded-2xl object-cover"
            />
          ))}
        </Reveal>
      </div>
    </Container>
  );
}

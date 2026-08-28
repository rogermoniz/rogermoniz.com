import Image from "next/image";
import { Reveal } from "@/components/effects/Reveal";
import {
  Container,
  Eyebrow,
  HeadingSub,
  SectionHeading2,
} from "@/components/primitives/Typography";
import { cloudinary } from "@/lib/cloudinary";
import type { HomePage, Review } from "@/lib/content/types";

/** Google's own brand colours: fixed by their trademark rules, never themed. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-8 max-md:size-[26px]">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/** Google review stars keep Google's amber for the same reason. */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 text-[#FBBC04]" aria-label={`${count} étoiles sur 5`}>
      {Array.from({ length: count }, (_, index) => (
        <svg key={index} viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current max-md:size-[17px]">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review, hidden }: { review: Review; hidden: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="flex w-[450px] shrink-0 flex-col gap-6 rounded-3xl border border-edge bg-surface-card p-10 max-md:w-[min(78vw,300px)] max-md:gap-[1.1rem] max-md:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={cloudinary(review.avatar.path, { width: 1000 })}
            alt={review.avatar.alt}
            width={48}
            height={48}
            loading="lazy"
            sizes="48px"
            className="size-12 rounded-full bg-surface object-cover max-md:size-10"
          />
          <figcaption className="flex flex-col">
            <span className="text-lg font-semibold max-md:text-base">{review.name}</span>
            <span className="text-sm text-muted max-md:text-[0.8rem]">{review.date}</span>
          </figcaption>
        </div>
        <GoogleMark />
      </div>
      <Stars count={review.stars} />
      <blockquote className="text-lg leading-relaxed text-muted max-md:text-[0.95rem] max-md:leading-[1.55]">
        {review.text}
      </blockquote>
    </figure>
  );
}

/**
 * Infinite testimonial ribbon. The set is rendered twice so translateX(-50%)
 * returns to an identical frame; the duplicate is hidden from assistive tech.
 */
export function ReviewsMarquee({ reviews }: { reviews: HomePage["reviews"] }) {
  return (
    <section className="relative z-10 overflow-hidden bg-surface pt-[clamp(140px,15vw,220px)] pb-[clamp(90px,10vw,140px)]">
      <Container>
        <div className="mb-24 text-center">
          <Eyebrow>{reviews.heading.eyebrow}</Eyebrow>
          <Reveal variant="text">
            <SectionHeading2>
              {reviews.heading.title}
              <HeadingSub>{reviews.heading.subtitle}</HeadingSub>
            </SectionHeading2>
          </Reveal>
        </div>
      </Container>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
        <div className="flex w-fit animate-reviews gap-8 hover:[animation-play-state:paused]">
          {reviews.items.map((review) => (
            <ReviewCard key={review.name} review={review} hidden={false} />
          ))}
          {reviews.items.map((review) => (
            <ReviewCard key={`echo-${review.name}`} review={review} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}

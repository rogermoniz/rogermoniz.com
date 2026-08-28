import Image from "next/image";
import Link from "next/link";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";
import {
  InstagramOutlineIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/primitives/SocialIcons";
import { getFooterImages, getNavigation, getSiteIdentity } from "@/lib/content/source";

const socialKey =
  "tactile flex size-12 items-center justify-center rounded-full text-ink transition-[box-shadow,color,transform] duration-300 hover:-translate-y-0.5 hover:text-accent";

const legalLink =
  "inline-flex items-center gap-1.5 text-[0.8rem] text-muted transition-colors duration-300 hover:text-accent";

/**
 * Server rendered: the footer holds no state. The ribbon is a pure CSS
 * marquee, so it costs no JavaScript at all.
 */
export async function SiteFooter() {
  const [images, nav, identity] = await Promise.all([
    getFooterImages(),
    getNavigation(),
    getSiteIdentity(),
  ]);
  const legalNav = nav.legalNav;
  const siteIdentity = identity;
  const strip = [...images, ...images];

  return (
    <footer
      id="contact"
      className="overflow-hidden bg-surface-footer pt-[clamp(60px,8vw,110px)] pb-[clamp(88px,9vw,120px)] text-ink"
    >
      <div className="relative mb-[clamp(44px,5vw,76px)] w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div className="flex w-max animate-footer-marquee motion-reduce:animate-none">
          {strip.map((src, index) => (
            <div
              key={`${src}-${index}`}
              aria-hidden="true"
              className="group mr-4 aspect-4/5 w-[clamp(180px,19vw,250px)] flex-none overflow-hidden rounded-[14px] bg-surface"
            >
              <Image
                src={src}
                alt=""
                width={500}
                height={625}
                loading="lazy"
                sizes="(max-width: 768px) 40vw, 250px"
                className="size-full object-cover transition-transform duration-800 ease-out-expo group-hover:scale-[1.06]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-[var(--padding-x)]">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 max-sm:items-start">
          <div className="flex flex-col gap-[0.65rem]">
            <Link
              href="/"
              className="font-display text-[clamp(1.9rem,3vw,2.7rem)] font-bold tracking-[-0.03em] text-ink uppercase transition-colors duration-300 hover:text-accent"
            >
              {siteIdentity.name}
            </Link>
            <span className="font-body text-[0.72rem] font-semibold tracking-[0.12em] text-muted uppercase">
              {siteIdentity.location}
            </span>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 max-sm:w-full">
              <a href={`mailto:${siteIdentity.email}`} className={socialKey} aria-label="Email">
                <MailIcon className="size-5" />
              </a>
              <a href={`tel:${siteIdentity.phone}`} className={socialKey} aria-label="Téléphone">
                <PhoneIcon className="size-5" />
              </a>
              <a
                href={siteIdentity.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className={socialKey}
                aria-label="Instagram"
              >
                <InstagramOutlineIcon className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(44px,5vw,70px)] flex flex-wrap items-center justify-start gap-x-10 gap-y-4 font-body text-[0.8rem] text-muted max-md:flex-col max-md:items-start max-md:gap-5">
          <span className="tracking-[0.01em]">
            © 2026 {siteIdentity.name} Tous droits réservés.
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {legalNav.map((link) => (
              <Link key={link.href} href={link.href} className={legalLink}>
                {link.label}
              </Link>
            ))}
            <CookiePreferencesButton className={legalLink} />
          </div>
        </div>
      </div>
    </footer>
  );
}

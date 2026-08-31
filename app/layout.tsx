import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import Script from "next/script";
import { CONSENT_BOOTSTRAP, CONSENT_DEFAULTS } from "@/lib/consent";
import { THEME_BOOTSTRAP, ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

/**
 * Self hosted through next/font, so there is no Google Fonts stylesheet on the
 * critical path and no layout shift when the face swaps in.
 */
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rogermoniz.com"),
  title: {
    default: "Bienvenue | Roger Moniz Photographe à Nice",
    template: "%s",
  },
  description:
    "Roger Moniz, photographe à Nice et sur la Côte d'Azur. Portrait, corporate, grossesse, événementiel et packshot.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Roger Moniz",
  },
  twitter: { card: "summary" },
};

/**
 * Pages are static, then re-read the database, so an edit appears without a
 * rebuild. Saving in the editor on the live site refreshes them at once; this
 * is the floor under that, and it is what carries an edit made anywhere else,
 * including from the editor running on a laptop, which can only refresh the
 * copy on that laptop. A minute is short enough that nobody wonders whether
 * their change was saved, and the site is 22 pages, so the cost is noise.
 */
export const revalidate = 60;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        {/*
          Two things have to be settled before anything is drawn, and neither can
          be settled on the server because both live in the reader's own storage:
          which theme to paint in, and whether the consent notice is being asked.
          These run inline, in document order, before the body is parsed.

          `next/script` will not do here, even at `beforeInteractive`: it queues
          the code for the framework runtime to pick up, which is late enough to
          flash a light page at a dark reader, and late enough that the notice,
          the largest element on a first visit, arrived seconds after the rest of
          the page and took Largest Contentful Paint with it.
        */}
        <script>{THEME_BOOTSTRAP}</script>
        <script>{CONSENT_BOOTSTRAP}</script>
        {/* Denied until the reader says otherwise. See lib/consent.ts. */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {CONSENT_DEFAULTS}
        </Script>
      </head>
      <body className={`${oswald.variable} ${inter.variable} font-body`}>
        <ThemeProvider>{children}</ThemeProvider>

      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import Script from "next/script";
import { CONSENT_DEFAULTS } from "@/lib/consent";
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

/** Pages are static, then re-read the database every 10 minutes, so an edit
 * in Supabase appears on the site without a rebuild. */
export const revalidate = 600;

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
        {/* Applies the reader's saved theme before first paint. */}
        <Script id="rm-theme" strategy="beforeInteractive">
          {THEME_BOOTSTRAP}
        </Script>
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

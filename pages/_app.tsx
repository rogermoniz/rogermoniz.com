import "../components/plasmic/blank_project/plasmic.css"; // plasmic-import: eYvaNejesYxSLtRjN5K9nx/projectcss
import "@/styles/globals.css";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlasmicRootProvider Head={Head} Link={Link}>
      {/* 1. Google Tag Manager — load on idle, off the critical path */}
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KM8Z9NSC');
          `
        }}
      />

      {/* 2. Google Analytics (gtag.js) — also on idle */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-S6WXWWKVQY"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S6WXWWKVQY');
        `}
      </Script>

      <Component {...pageProps} />
      <Analytics />
    </PlasmicRootProvider>
  );
}

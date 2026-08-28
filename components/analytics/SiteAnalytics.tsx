"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";

const GTM_ID = "GTM-KM8Z9NSC";
const GA_ID = "G-S6WXWWKVQY";

/**
 * Measurement, and only once it has been agreed to.
 *
 * The tags are not merely told to hold back: they are never added to the page
 * until consent exists, so no request reaches Google and nothing is stored
 * before the reader has said yes.
 */
/*
 * Note the strategy: lazyOnload waits for the window load event, which has
 * already fired by the time consent is given, so the tags would never inject.
 * afterInteractive adds them as soon as this renders.
 */
export function SiteAnalytics() {
  const { consent } = useConsent();
  if (!consent?.analytics) return null;

  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}

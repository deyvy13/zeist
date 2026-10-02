import Script from "next/script";
import { consentDeniedRegions, gaMeasurementId } from "@/lib/analytics";

// GA4 loader. Renders nothing unless NEXT_PUBLIC_GA_ID is set at build time.
//
// Consent defaults are pushed before `config`, region-scoped: analytics
// cookies are off in the EEA/UK/CH (no banner exists to ask), on elsewhere.
// Page changes in the App Router are picked up by GA4's enhanced measurement
// ("page changes based on browser history events"), so no router hook needed.

export function Analytics() {
  if (!gaMeasurementId) return null;

  const regions = JSON.stringify(consentDeniedRegions);
  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', region: ${regions} });
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');
`;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}

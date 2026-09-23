import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { SITE_URL, CONTACT } from "@/lib/contact";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { en } from "@/lib/i18n/dictionary";
import { SiteLoader } from "@/components/SiteLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Only fetched when Devanagari text is actually on screen (Hindi), so English visitors never pay for it.
const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  display: "swap",
  preload: false,
});

const BUSINESS_NAME = "Deolikar Mutual Funds and Investment Services";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: en.meta.title,
  description: en.meta.description,
  keywords: [
    "Deolikar Mutual Funds",
    "Deolikar Wealth Advisors",
    "Mutual Fund Distributor",
    "SIP Calculator",
    "SWP Calculator",
    "Financial Planner India",
    "AMFI Registered Mutual Fund Distributor",
    "ARN 289210",
  ],
  authors: [{ name: BUSINESS_NAME }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BUSINESS_NAME,
    title: en.meta.title,
    description: en.meta.description,
    locale: "en_IN",
    alternateLocale: ["hi_IN"],
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: en.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#011434",
  width: "device-width",
  initialScale: 1,
};

/** Only facts supplied by the business — no ratings, reviews, awards or invented details. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": `${SITE_URL}/#business`,
  name: BUSINESS_NAME,
  alternateName: "Deolikar Wealth Advisors",
  description: en.meta.description,
  slogan: en.hero.headline,
  url: SITE_URL,
  telephone: "+91-9075545105",
  email: CONTACT.email,
  image: `${SITE_URL}/brand/deolikar-logo.jpeg`,
  logo: `${SITE_URL}/brand/deolikar-mark.png`,
  areaServed: { "@type": "Country", name: "India" },
  identifier: { "@type": "PropertyValue", name: "AMFI Registration Number (ARN)", value: CONTACT.arn },
  knowsLanguage: ["en", "hi"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Key Services",
    itemListElement: en.services.items.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title, description: service.description },
    })),
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9075545105",
    email: CONTACT.email,
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
};

/**
 * Runs before first paint: flags JS (so scroll-reveal only hides content when it can
 * reveal it again), restores the saved language, and skips the loader on repeat views.
 */
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var l=localStorage.getItem('deolikar-lang');if(l==='hi'){d.lang='hi';d.setAttribute('data-lang','hi');}if(sessionStorage.getItem('deolikar-seen')){d.setAttribute('data-seen','');}else{sessionStorage.setItem('deolikar-seen','1');}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} ${devanagari.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-white text-ink-900">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <SiteLoader />
        <LanguageProvider>
          <div id="app-shell" className="flex flex-1 flex-col">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

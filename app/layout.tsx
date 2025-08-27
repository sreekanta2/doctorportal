import { siteConfig } from "@/config/site";
import AuthProvider from "@/provider/auth.provicer";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./assets/scss/globals.scss";

/* -----------------------------
   ✅ Font Configuration
----------------------------- */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap", // ⚡ Improves CLS & Core Web Vitals
});

/* -----------------------------
   ✅ Global Metadata (applies everywhere)
----------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    images: [siteConfig.ogImage],
  },
  verification: {
    google: siteConfig.googleSiteVerification,
    other: {
      ahrefs: siteConfig.ahrefsVerification,
    },
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

/* -----------------------------
   ✅ Structured Data (Org level)
   ⚡ Future: Extend with dynamic Doctor/Clinic schema inside each layout
----------------------------- */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    "@id": `${siteConfig.url}/#logo`,
    url: siteConfig.logo || `${siteConfig.url}/logo.png`,
    width: "300",
    height: "60",
    caption: siteConfig.name,
  },
  sameAs: siteConfig.socialLinks?.map((link) => link.url) || [],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: siteConfig.contact?.phone || "+1-555-123-4567",
      contactType: "Customer Support",
      areaServed: "BD",
      availableLanguage: ["en", "bn"], // ⚡ Local SEO (English + Bengali)
    },
  ],
  medicalSpecialty: "Healthcare",
};

/* -----------------------------
   ✅ Google Analytics (Production only)
----------------------------- */
const GoogleAnalytics = () => {
  if (process.env.NODE_ENV !== "production" || !siteConfig.googleAnalyticsId) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${siteConfig.googleAnalyticsId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
};

/* -----------------------------
   ✅ Root Layout
   - Handles global SEO + Analytics + Theme + PWA
----------------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      prefix="og: https://ogp.me/ns#"
      suppressHydrationWarning
      className={poppins.variable}
    >
      <head>
        {/* Progressive Web App (PWA) Setup */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <AuthProvider>
        <body className={poppins.className}>
          {children}
          <Toaster />

          {/* ✅ Global Structured Data */}
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
            strategy="afterInteractive"
          />

          {/* ✅ Analytics */}
          <GoogleAnalytics />
        </body>
      </AuthProvider>
    </html>
  );
}

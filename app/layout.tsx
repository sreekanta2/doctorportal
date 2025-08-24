import { siteConfig } from "@/config/site";
import AuthProvider from "@/provider/auth.provicer";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./assets/scss/globals.scss";

// Font configuration
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

// Metadata configuration
export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords || [],
  authors: [
    {
      name: siteConfig.author || "Your Company",
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author || "Your Company",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage || `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage || `${siteConfig.url}/og-image.jpg`],
    creator: siteConfig.twitterHandle || "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: ["/favicon-16x16.png"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json", // Changed from site.webmanifest to manifest.json
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google:
      siteConfig.googleSiteVerification || "your-google-verification-code",
  },
  category: "Healthcare",
  other: {
    "ahrefs-site-verification":
      siteConfig.ahrefsVerification || "your-ahrefs-code",
  },
};

// Structured data configuration

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
      areaServed: "US",
      availableLanguage: "en",
    },
  ],
  medicalSpecialty: "Healthcare",
};

// Google Analytics script component
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />{" "}
        {/* Added manifest link */}
      </head>
      <AuthProvider>
        <body className={poppins.className}>
          {children}
          <Toaster />

          {/* Structured Data */}
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
            strategy="afterInteractive"
          />

          <GoogleAnalytics />
        </body>
      </AuthProvider>
    </html>
  );
}

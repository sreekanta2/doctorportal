import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Top Doctors | Book Appointments Online",
  description:
    "Search and book appointments with certified doctors by specialty, location, and availability. Read verified patient reviews.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
  },
  openGraph: {
    title: "Find and Book Doctors Near You",
    description: "Connect with qualified healthcare providers in your area",
    url: `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
    siteName: "MediBook",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_API_URL}/og-doctors.jpg`,
        width: 1200,
        height: 630,
        alt: "Find and book doctors online",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find and Book Doctors Near You",
    description: "Connect with qualified healthcare providers in your area",
    images: [`${process.env.NEXT_PUBLIC_API_URL}/og-doctors.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
  category: "healthcare",
  other: {
    "ahrefs-site-verification": "YOUR_AHREFS_TOKEN",
  },
};

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:border focus:rounded-lg"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-grow">
        {children}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: "MediBook",
            url: `${process.env.NEXT_PUBLIC_API_URL}`,
            logo: `${process.env.NEXT_PUBLIC_API_URL}/logo.jpg`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-555-123-4567",
              contactType: "Customer service",
              areaServed: "US",
              availableLanguage: "English",
            },
            sameAs: [
              "https://www.facebook.com/yourpage",
              "https://twitter.com/yourpage",
              "https://www.instagram.com/yourpage",
              "https://www.linkedin.com/company/yourpage",
            ],
          }),
        }}
      />
    </div>
  );
}

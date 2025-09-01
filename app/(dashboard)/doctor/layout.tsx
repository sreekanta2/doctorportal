import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: `Clinics | ${siteConfig.name}`,
  description: `Find top-rated clinics and book appointments online.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_API_URL}/clinics` },
  openGraph: { title: `Clinics | ${siteConfig.name}` },
  robots: { index: true, follow: true },
};

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main id="main-content" className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}

import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Doctors | ${siteConfig.name}`,
  description: `Find top-rated doctors and book appointments online.`,
  alternates: { canonical: `${process.env.NEXT_PUBLIC_API_URL}/doctors` },
  openGraph: { title: `Doctors | ${siteConfig.name}` },
  robots: { index: true, follow: true },
};
export default function DoctorsLayout({
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

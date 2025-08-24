import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
export const metadata = {
  title: "About us",
  defaultTitle: "MedCare HMS",
  description:
    "Get in touch with MedCare Hospital Management System for inquiries, support, and feedback",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

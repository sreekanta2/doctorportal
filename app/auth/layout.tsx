import Header from "@/components/landing-page/header";

export const metadata = {
  title: "Authentication",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;

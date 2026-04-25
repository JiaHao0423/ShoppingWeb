import { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

type DefaultLayoutProps = {
  children: ReactNode;
  variant?: "default" | "search";
};

const DefaultLayout = ({ children, variant = "default" }: DefaultLayoutProps) => {
  return (
    <>
      <Header variant={variant} />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;

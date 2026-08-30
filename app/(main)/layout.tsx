import React from "react";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import PWAInstallBanner from "../../components/PWA/PWAInstallBanner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <ScrollToTop />
      <PWAInstallBanner />
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

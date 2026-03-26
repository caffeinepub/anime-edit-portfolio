import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import LoginModal from "./components/LoginModal";
import ShowcaseSection from "./components/ShowcaseSection";
import { useIsAdmin } from "./hooks/useQueries";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Header onLoginClick={() => setLoginOpen(true)} />

      <main>
        <HeroSection />
        <ShowcaseSection isAdmin={!!isAdmin} />
        <AboutSection isAdmin={!!isAdmin} />
      </main>

      <Footer />

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <Toaster richColors position="top-right" />
    </div>
  );
}

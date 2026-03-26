import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, LogOut, Menu, Sword, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  onLoginClick: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      onLoginClick();
    }
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Showcase", href: "#showcase" },
    { label: "About", href: "#about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan">
              <Sword className="w-5 h-5 text-cyan" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-widest uppercase text-foreground">
              <span className="gradient-text-cyan">Anime</span>Cut Studio
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className="text-sm font-medium text-muted-foreground hover:text-cyan transition-colors uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={handleAuth}
              disabled={isLoggingIn}
              data-ocid="nav.auth.button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-transparent hover:border-border"
            >
              {isLoggingIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isAuthenticated ? (
                <LogOut className="w-3.5 h-3.5" />
              ) : (
                <LogIn className="w-3.5 h-3.5" />
              )}
              {isLoggingIn
                ? "Logging in..."
                : isAuthenticated
                  ? "Logout"
                  : "Admin"}
            </button>
            <a
              href="mailto:contact@animecutstudio.com"
              data-ocid="nav.book.button"
            >
              <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan text-xs font-semibold uppercase tracking-wider px-5">
                Book A Project
              </Button>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-cyan transition-colors uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => {
                handleAuth();
                setMobileOpen(false);
              }}
              className="text-sm text-muted-foreground hover:text-foreground text-left"
            >
              {isAuthenticated ? "Logout" : "Admin Login"}
            </button>
            <a href="mailto:contact@animecutstudio.com">
              <Button className="w-full rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
                Book A Project
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

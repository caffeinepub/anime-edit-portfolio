import { ArrowUp, Sword } from "lucide-react";
import { SiInstagram, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-card border-t border-border pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {["Home", "Showcase", "About"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-cyan transition-colors"
                    data-ocid={`footer.${link.toLowerCase()}.link`}
                  >
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:contact@animecutstudio.com"
                  className="text-sm text-muted-foreground hover:text-cyan transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Logo + Social */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan">
                <Sword className="w-5 h-5 text-cyan" />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase">
                <span className="gradient-text-cyan">Anime</span>Cut Studio
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-48">
              Crafting cinematic anime stories through motion and sound.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan transition-colors"
                data-ocid="footer.youtube.link"
              >
                <SiYoutube className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan transition-colors"
                data-ocid="footer.x.link"
              >
                <SiX className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-cyan transition-colors"
                data-ocid="footer.instagram.link"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Stay Updated
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Get notified when new edits drop.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-colors"
                data-ocid="footer.input"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs font-semibold hover:bg-teal transition-colors glow-cyan"
                data-ocid="footer.submit_button"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>

      {/* Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        data-ocid="footer.button"
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-primary/10 border border-cyan/40 flex items-center justify-center text-cyan hover:bg-cyan/20 transition-all glow-cyan z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
}

import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Play } from "lucide-react";
import { motion } from "motion/react";

const FLOATING_CARDS = [
  {
    src: "/assets/generated/thumb-amv1.dim_640x360.jpg",
    id: "fc-amv1-tl",
    style: "top-12 left-4 w-36 h-20 rotate-[-8deg]",
    delay: 0,
  },
  {
    src: "/assets/generated/thumb-mad1.dim_640x360.jpg",
    id: "fc-mad1-tl2",
    style: "top-32 left-16 w-28 h-16 rotate-[5deg]",
    delay: 0.5,
  },
  {
    src: "/assets/generated/thumb-edit1.dim_640x360.jpg",
    id: "fc-edit1-bl",
    style: "bottom-32 left-8 w-40 h-24 rotate-[-5deg]",
    delay: 1,
  },
  {
    src: "/assets/generated/thumb-amv2.dim_640x360.jpg",
    id: "fc-amv2-bl2",
    style: "bottom-16 left-24 w-32 h-18 rotate-[6deg]",
    delay: 0.3,
  },
  {
    src: "/assets/generated/thumb-amv1.dim_640x360.jpg",
    id: "fc-amv1-tr",
    style: "top-16 right-4 w-36 h-20 rotate-[7deg]",
    delay: 0.8,
  },
  {
    src: "/assets/generated/thumb-mad1.dim_640x360.jpg",
    id: "fc-mad1-tr2",
    style: "top-40 right-20 w-28 h-16 rotate-[-4deg]",
    delay: 0.2,
  },
  {
    src: "/assets/generated/thumb-edit1.dim_640x360.jpg",
    id: "fc-edit1-br",
    style: "bottom-28 right-6 w-40 h-24 rotate-[4deg]",
    delay: 1.2,
  },
  {
    src: "/assets/generated/thumb-amv2.dim_640x360.jpg",
    id: "fc-amv2-br2",
    style: "bottom-12 right-28 w-32 h-18 rotate-[-7deg]",
    delay: 0.6,
  },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Floating thumbnail cards */}
      <div className="absolute inset-0 pointer-events-none">
        {FLOATING_CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: card.delay, duration: 0.8 }}
            className={`absolute rounded-lg overflow-hidden border border-neon-purple/40 shadow-lg hidden lg:block ${card.style}`}
            style={{
              animation: `float ${4 + i * 0.5}s ease-in-out ${card.delay}s infinite`,
            }}
          >
            <img src={card.src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-7 h-7 rounded-full bg-cyan/80 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-primary-foreground fill-current ml-0.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan mb-6 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5">
            Professional Anime Video Editor
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-tight tracking-tight text-foreground mb-6"
        >
          Amplifying Anime.{" "}
          <span className="gradient-text-cyan glow-text-cyan">Elevating</span>{" "}
          Stories.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed"
        >
          Professional anime video editor crafting cinematic AMVs, MADs and
          edits that tell stories through motion, sync, and emotion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-1.5 text-sm text-cyan/70 mb-8"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Based in Odisha, India</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#showcase" data-ocid="hero.showcase.button">
            <Button
              size="lg"
              className="rounded-full bg-cyan text-primary-foreground hover:bg-teal font-bold uppercase tracking-widest text-sm px-8 py-6 glow-cyan transition-all duration-300"
            >
              Explore Showcase
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </a>
          <a
            href="mailto:contact@animecutstudio.com"
            data-ocid="hero.request.button"
          >
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-cyan/50 text-cyan hover:bg-cyan/10 font-bold uppercase tracking-widest text-sm px-8 py-6 transition-all duration-300"
            >
              Request Edit
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

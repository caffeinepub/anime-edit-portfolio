import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useGetProfile } from "../hooks/useQueries";
import type { Profile } from "../hooks/useQueries";
import EditProfileModal from "./EditProfileModal";

const DEFAULT_PROFILE: Profile = {
  bio: "Passionate anime video editor with 5+ years of experience crafting emotionally-driven AMVs and MADs. Specializing in motion sync, color grading, and cinematic storytelling.",
  skills: [
    "After Effects",
    "Premiere Pro",
    "DaVinci Resolve",
    "Motion Sync",
    "Color Grading",
    "Typesetting",
    "Sound Design",
    "Visual Effects",
  ],
};

interface AboutSectionProps {
  isAdmin: boolean;
}

export default function AboutSection({ isAdmin }: AboutSectionProps) {
  const [editOpen, setEditOpen] = useState(false);
  const { data: profile } = useGetProfile();
  const displayProfile = profile?.bio ? profile : DEFAULT_PROFILE;

  return (
    <section id="about" className="py-24 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border-glow-purple aspect-[3/4] max-w-sm mx-auto lg:mx-0">
              <img
                src="/assets/generated/alex-kai-profile.dim_600x700.jpg"
                alt="Trinath Prasad Mohapatra"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            {/* Floating secondary card */}
            <div className="absolute -bottom-6 -right-2 lg:-right-8 w-36 h-24 rounded-xl overflow-hidden border-glow-cyan hidden sm:block">
              <img
                src="/assets/generated/thumb-amv1.dim_640x360.jpg"
                alt="Featured work"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
                About
              </span>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-foreground mt-2">
                About{" "}
                <span className="gradient-text-cyan">
                  Trinath Prasad Mohapatra
                </span>
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {displayProfile.bio}
            </p>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayProfile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="px-3 py-1 bg-secondary border border-cyan/20 text-cyan/80 font-medium text-xs rounded-full hover:border-cyan/50 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {isAdmin && (
              <Button
                onClick={() => setEditOpen(true)}
                variant="outline"
                className="border-cyan/40 text-cyan hover:bg-cyan/10 rounded-full text-xs font-semibold uppercase tracking-wider"
                data-ocid="about.edit_button"
              >
                <Edit2 className="w-3.5 h-3.5 mr-2" />
                Edit Profile
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={displayProfile}
      />
    </section>
  );
}

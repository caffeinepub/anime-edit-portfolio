import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateProfile } from "../hooks/useQueries";
import type { Profile } from "../hooks/useQueries";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function EditProfileModal({
  open,
  onClose,
  profile,
}: EditProfileModalProps) {
  const [bio, setBio] = useState(profile.bio);
  const [skillsInput, setSkillsInput] = useState(profile.skills.join(", "));
  const updateProfile = useUpdateProfile();

  const handleSave = async () => {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await updateProfile.mutateAsync({ bio, skills });
      toast.success("Profile updated!");
      onClose();
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg bg-card border-glow-cyan"
        data-ocid="about.modal"
      >
        <DialogHeader>
          <DialogTitle className="gradient-text-cyan font-bold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="bg-input border-border resize-none"
              data-ocid="about.textarea"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profile-skills">Skills (comma-separated)</Label>
            <Input
              id="profile-skills"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="After Effects, Premiere Pro, ..."
              className="bg-input border-border"
              data-ocid="about.input"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="about.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="bg-primary text-primary-foreground glow-cyan"
            data-ocid="about.save_button"
          >
            {updateProfile.isPending ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : null}
            {updateProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

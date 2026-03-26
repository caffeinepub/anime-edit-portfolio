import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";
import type { VideoEntry } from "../hooks/useQueries";

const CATEGORY_COLORS: Record<string, string> = {
  AMV: "bg-cyan/20 text-cyan border-cyan/40",
  MAD: "bg-magenta/20 text-magenta border-magenta/40",
  Edit: "bg-neon-purple/20 text-neon-purple border-neon-purple/40",
};

interface VideoDetailModalProps {
  entry: VideoEntry | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoDetailModal({
  entry,
  open,
  onClose,
}: VideoDetailModalProps) {
  if (!entry) return null;

  const thumbnailUrl = (() => {
    try {
      return entry.asset.getDirectURL();
    } catch {
      return null;
    }
  })();

  const categoryColor =
    CATEGORY_COLORS[entry.category] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl bg-card border-glow-purple"
        data-ocid="showcase.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <Badge
              className={`text-xs font-semibold uppercase border ${categoryColor}`}
            >
              {entry.category}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {entry.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Anime: {entry.animeName}
          </p>
        </DialogHeader>

        <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={entry.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan/10 to-neon-purple/20 flex items-center justify-center">
              <Play className="w-16 h-16 text-cyan/50" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-cyan/80 flex items-center justify-center glow-cyan cursor-pointer hover:bg-cyan transition-colors">
              <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
        </div>

        {entry.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {entry.description}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

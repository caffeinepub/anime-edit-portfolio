import { Badge } from "@/components/ui/badge";
import { Edit2, Play, Trash2 } from "lucide-react";
import type { VideoEntry } from "../hooks/useQueries";

const CATEGORY_COLORS: Record<string, string> = {
  AMV: "bg-cyan/20 text-cyan border-cyan/40",
  MAD: "bg-magenta/20 text-magenta border-magenta/40",
  Edit: "bg-neon-purple/20 text-neon-purple border-neon-purple/40",
};

interface VideoCardProps {
  entry: VideoEntry;
  entryId: string;
  index: number;
  isAdmin: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function VideoCard({
  entry,
  index,
  isAdmin,
  onClick,
  onEdit,
  onDelete,
}: VideoCardProps) {
  const thumbnailUrl = (() => {
    try {
      const url = entry.asset.getDirectURL();
      return url || null;
    } catch {
      return null;
    }
  })();

  const gradients = [
    "from-cyan/20 via-background to-neon-purple/20",
    "from-magenta/20 via-background to-cyan/20",
    "from-neon-purple/20 via-background to-teal/20",
    "from-teal/20 via-background to-magenta/20",
  ];

  const categoryColor =
    CATEGORY_COLORS[entry.category] ??
    "bg-muted text-muted-foreground border-border";

  return (
    <button
      type="button"
      className="group relative w-full rounded-xl overflow-hidden border-glow-purple bg-card cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-purple text-left"
      data-ocid={`showcase.item.${index}`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}
          >
            <Play className="w-10 h-10 text-cyan/60" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-cyan/80 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 glow-cyan">
            <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>
        {/* Published indicator */}
        {!entry.isPublished && (
          <div className="absolute top-2 left-2 bg-background/80 text-muted-foreground text-xs px-2 py-0.5 rounded-full">
            Draft
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge
            className={`text-xs font-semibold uppercase border ${categoryColor}`}
          >
            {entry.category}
          </Badge>
          {isAdmin && (
            <div
              className="flex gap-1"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onEdit}
                data-ocid={`showcase.edit_button.${index}`}
                className="p-1.5 rounded-md bg-secondary hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                data-ocid={`showcase.delete_button.${index}`}
                className="p-1.5 rounded-md bg-secondary hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-1">
          {entry.title}
        </h3>
        <p className="text-xs text-muted-foreground">{entry.animeName}</p>
      </div>
    </button>
  );
}

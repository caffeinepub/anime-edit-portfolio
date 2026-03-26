import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useDeleteVideo, useGetPublishedVideos } from "../hooks/useQueries";
import type { VideoEntry } from "../hooks/useQueries";
import AddEditVideoModal from "./AddEditVideoModal";
import VideoCard from "./VideoCard";
import VideoDetailModal from "./VideoDetailModal";

const FILTERS = ["All", "AMV", "MAD", "Edit"] as const;

const SAMPLE_VIDEOS: Array<VideoEntry & { _id: string }> = [
  {
    _id: "sample-1",
    title: "Resonance",
    description:
      "An emotional AMV following the journey of isolation and connection through attack sequences and quiet moments.",
    category: "AMV",
    animeName: "Attack on Titan",
    isPublished: true,
    asset: ExternalBlob.fromURL("/assets/generated/thumb-amv1.dim_640x360.jpg"),
  },
  {
    _id: "sample-2",
    title: "Inferno",
    description:
      "A high-energy MAD featuring intense combat scenes synchronized to an orchestral metal track.",
    category: "MAD",
    animeName: "Demon Slayer",
    isPublished: true,
    asset: ExternalBlob.fromURL("/assets/generated/thumb-mad1.dim_640x360.jpg"),
  },
  {
    _id: "sample-3",
    title: "Ethereal Dreams",
    description:
      "A dreamy, pastel-toned edit exploring themes of wonder and nostalgia through soft transitions.",
    category: "Edit",
    animeName: "Violet Evergarden",
    isPublished: true,
    asset: ExternalBlob.fromURL(
      "/assets/generated/thumb-edit1.dim_640x360.jpg",
    ),
  },
  {
    _id: "sample-4",
    title: "Thunder Strike",
    description:
      "An epic AMV capturing the raw power of lightning-fast battles with thunderous sound design.",
    category: "AMV",
    animeName: "My Hero Academia",
    isPublished: true,
    asset: ExternalBlob.fromURL("/assets/generated/thumb-amv2.dim_640x360.jpg"),
  },
];

interface ShowcaseSectionProps {
  isAdmin: boolean;
}

export default function ShowcaseSection({ isAdmin }: ShowcaseSectionProps) {
  const [filter, setFilter] = useState<string>("All");
  const [detailEntry, setDetailEntry] = useState<VideoEntry | null>(null);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    id: string;
    entry: VideoEntry;
  } | null>(null);

  const { data: backendVideos, isLoading } = useGetPublishedVideos();
  const deleteVideo = useDeleteVideo();

  const backendItems = (backendVideos ?? []).map((v, i) => ({
    ...v,
    _id: `backend-${i}`,
  }));
  const allItems = backendItems.length > 0 ? backendItems : SAMPLE_VIDEOS;

  const filtered =
    filter === "All" ? allItems : allItems.filter((v) => v.category === filter);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await deleteVideo.mutateAsync(id);
      toast.success("Video deleted.");
    } catch {
      toast.error("Failed to delete video.");
    }
  };

  const handleEdit = (item: VideoEntry & { _id: string }) => {
    setEditTarget({ id: item._id, entry: item });
    setAddEditOpen(true);
  };

  return (
    <section id="showcase" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
            The <span className="gradient-text-cyan">Showcase</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A curated selection of cinematic anime edits, AMVs, and MADs.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              data-ocid="showcase.filter.tab"
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 border ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary glow-cyan"
                  : "border-border text-muted-foreground hover:border-cyan/50 hover:text-cyan"
              }`}
            >
              {f}
            </button>
          ))}
          {isAdmin && (
            <Button
              onClick={() => {
                setEditTarget(null);
                setAddEditOpen(true);
              }}
              className="ml-2 rounded-full bg-secondary border border-cyan/40 text-cyan hover:bg-cyan/10 text-xs font-semibold uppercase tracking-wider"
              data-ocid="showcase.open_modal_button"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Video
            </Button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-ocid="showcase.loading_state"
          >
            {(["s1", "s2", "s3", "s4"] as const).map((k) => (
              <div
                key={k}
                className="rounded-xl aspect-video bg-secondary animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <VideoCard
                  entry={item}
                  entryId={item._id}
                  index={i + 1}
                  isAdmin={isAdmin}
                  onClick={() => setDetailEntry(item)}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="showcase.empty_state"
          >
            <p className="text-lg font-medium">
              No videos in this category yet.
            </p>
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="rounded-full border-cyan/40 text-cyan hover:bg-cyan/10 px-8 uppercase tracking-wider text-xs font-semibold"
            data-ocid="showcase.secondary_button"
          >
            View All
          </Button>
        </div>
      </div>

      {/* Modals */}
      <VideoDetailModal
        entry={detailEntry}
        open={!!detailEntry}
        onClose={() => setDetailEntry(null)}
      />
      <AddEditVideoModal
        open={addEditOpen}
        onClose={() => {
          setAddEditOpen(false);
          setEditTarget(null);
        }}
        editEntry={editTarget}
      />
    </section>
  );
}

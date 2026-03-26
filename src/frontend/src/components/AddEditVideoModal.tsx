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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useCreateVideo, useUpdateVideo } from "../hooks/useQueries";
import type { VideoEntry } from "../hooks/useQueries";

interface AddEditVideoModalProps {
  open: boolean;
  onClose: () => void;
  editEntry?: { id: string; entry: VideoEntry } | null;
}

export default function AddEditVideoModal({
  open,
  onClose,
  editEntry,
}: AddEditVideoModalProps) {
  const isEdit = !!editEntry;
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();

  const [title, setTitle] = useState(editEntry?.entry.title ?? "");
  const [description, setDescription] = useState(
    editEntry?.entry.description ?? "",
  );
  const [category, setCategory] = useState(editEntry?.entry.category ?? "AMV");
  const [animeName, setAnimeName] = useState(editEntry?.entry.animeName ?? "");
  const [isPublished, setIsPublished] = useState(
    editEntry?.entry.isPublished ?? true,
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const isPending = createVideo.isPending || updateVideo.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailFile(file);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !animeName.trim()) {
      toast.error("Title and anime name are required.");
      return;
    }

    let asset: ExternalBlob;
    if (thumbnailFile) {
      const bytes = new Uint8Array(await thumbnailFile.arrayBuffer());
      asset = ExternalBlob.fromBytes(bytes).withUploadProgress((p) =>
        setUploadProgress(p),
      );
    } else if (editEntry?.entry.asset) {
      asset = editEntry.entry.asset;
    } else {
      asset = ExternalBlob.fromBytes(new Uint8Array(0));
    }

    const entry: VideoEntry = {
      title,
      description,
      category,
      animeName,
      isPublished,
      asset,
    };

    try {
      if (isEdit && editEntry) {
        await updateVideo.mutateAsync({ id: editEntry.id, entry });
        toast.success("Video updated successfully!");
      } else {
        const id = `video-${Date.now()}`;
        await createVideo.mutateAsync({ id, entry });
        toast.success("Video added successfully!");
      }
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg bg-card border-glow-cyan"
        data-ocid="showcase.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold gradient-text-cyan">
            {isEdit ? "Edit Video" : "Add New Video"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="video-title">Title *</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="bg-input border-border"
              data-ocid="showcase.input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="video-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="video-category"
                  className="bg-input border-border"
                  data-ocid="showcase.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMV">AMV</SelectItem>
                  <SelectItem value="MAD">MAD</SelectItem>
                  <SelectItem value="Edit">Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="video-anime">Anime Name *</Label>
              <Input
                id="video-anime"
                value={animeName}
                onChange={(e) => setAnimeName(e.target.value)}
                placeholder="e.g. Demon Slayer"
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="video-desc">Description</Label>
            <Textarea
              id="video-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video..."
              className="bg-input border-border resize-none"
              rows={3}
              data-ocid="showcase.textarea"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thumbnail-upload">Thumbnail</Label>
            <label
              htmlFor="thumbnail-upload"
              className="block border border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-cyan/50 transition-colors"
              data-ocid="showcase.dropzone"
            >
              <input
                ref={fileRef}
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {thumbnailFile ? (
                <p className="text-sm text-cyan">{thumbnailFile.name}</p>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Click to upload thumbnail</span>
                </div>
              )}
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div
                  className="bg-cyan h-1.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="video-published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
              data-ocid="showcase.switch"
            />
            <Label htmlFor="video-published" className="text-sm cursor-pointer">
              Published
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="showcase.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-primary-foreground glow-cyan"
            data-ocid="showcase.submit_button"
          >
            {isPending ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : null}
            {isPending ? "Saving..." : isEdit ? "Update Video" : "Add Video"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

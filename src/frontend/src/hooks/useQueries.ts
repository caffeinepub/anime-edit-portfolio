import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type { Profile, UserProfile, VideoEntry } from "../backend";
import { useActor } from "./useActor";

export { ExternalBlob };
export type { VideoEntry, Profile, UserProfile };

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetPublishedVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["publishedVideos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedVideoEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["allVideos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideoEntriesSortedByAnimeName();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return { bio: "", skills: [] };
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideosByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["videosByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getPublishedVideoEntries();
      return actor.getVideoEntriesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, entry }: { id: string; entry: VideoEntry }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.createVideoEntry(id, entry);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publishedVideos"] });
      qc.invalidateQueries({ queryKey: ["allVideos"] });
      qc.invalidateQueries({ queryKey: ["videosByCategory"] });
    },
  });
}

export function useUpdateVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, entry }: { id: string; entry: VideoEntry }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.updateVideoEntry(id, entry);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publishedVideos"] });
      qc.invalidateQueries({ queryKey: ["allVideos"] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.deleteVideoEntry(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["publishedVideos"] });
      qc.invalidateQueries({ queryKey: ["allVideos"] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.updateProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userProfile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.saveCallerUserProfile(userProfile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

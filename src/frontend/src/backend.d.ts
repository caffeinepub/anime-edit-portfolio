import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface VideoEntry {
    title: string;
    asset: ExternalBlob;
    isPublished: boolean;
    description: string;
    animeName: string;
    category: string;
}
export interface Profile {
    bio: string;
    skills: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createVideoEntry(id: string, entry: VideoEntry): Promise<void>;
    deleteVideoEntry(id: string): Promise<void>;
    getAllVideoEntriesSortedByAnimeName(): Promise<Array<VideoEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfile(): Promise<Profile>;
    getPublishedVideoEntries(): Promise<Array<VideoEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoAsset(id: string): Promise<ExternalBlob>;
    getVideoEntriesByCategory(category: string): Promise<Array<VideoEntry>>;
    getVideoEntry(id: string): Promise<VideoEntry>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(userProfile: UserProfile): Promise<void>;
    searchByAnimeName(term: string): Promise<Array<VideoEntry>>;
    updateProfile(newProfile: Profile): Promise<void>;
    updateVideoEntry(id: string, entry: VideoEntry): Promise<void>;
}

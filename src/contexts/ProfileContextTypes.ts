
import { Profile } from "@/types/profile";
import { ReactNode } from "react";

export interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  addProfile: (profile: Omit<Profile, "id">) => void;
  selectProfile: (profileId: string, password?: string) => boolean;
  updateProfile: (profile: Profile) => void;
  deleteProfile: (profileId: string) => void;
  exportProfileData: (profileId: string) => void;
  importProfileData: (data: string, profileId: string) => void;
  isProfileSelectorOpen: boolean;
  setProfileSelectorOpen: (open: boolean) => void;
  saveProfileData: (profileId: string, dataKey: string, data: any) => void;
  getProfileData: <T>(profileId: string, dataKey: string, defaultValue?: T) => T | undefined;
  resetAllProfileDataOnLoad: (excludeProfileId?: string) => void;
}

export interface ProfileProviderProps {
  children: ReactNode;
}

// Default profile
export const defaultProfile: Profile = {
  id: "default",
  name: "Mi Empresa",
  currency: "MXN",
  iconName: "building",
  lastActive: new Date(),
};

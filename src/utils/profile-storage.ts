
import { Profile, ProfileData } from "@/types/profile";

export const STORAGE_PREFIX = "MotoBolt_";

/**
 * Save profile data to localStorage
 */
export const saveProfileData = (profileId: string, dataKey: string, data: any) => {
  const key = `${STORAGE_PREFIX}${profileId}_${dataKey}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Get profile data from localStorage
 */
export const getProfileData = <T,>(profileId: string, dataKey: string, defaultValue?: T): T | undefined => {
  const key = `${STORAGE_PREFIX}${profileId}_${dataKey}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch (e) {
      console.error(`Error parsing stored data for ${key}:`, e);
      return defaultValue;
    }
  }
  return defaultValue;
};

/**
 * Clean up all data for a given profile
 */
export const cleanupProfileData = (profileId: string) => {
  // Find and remove all localStorage items for this profile
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`${STORAGE_PREFIX}${profileId}_`)) {
      localStorage.removeItem(key);
    }
  });
};


import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Profile, ProfileData } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";

interface ProfileContextType {
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
  resetAllProfileDataOnLoad: (excludeProfileId?: string) => void; // Nueva función para limpiar datos
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Default profile
const defaultProfile: Profile = {
  id: "default",
  name: "Mi Empresa",
  currency: "MXN",
  iconName: "building",
  lastActive: new Date(),
};

// Storage utilities for profile data
const STORAGE_PREFIX = "MotoBolt_";

const saveProfileData = (profileId: string, dataKey: string, data: any) => {
  const key = `${STORAGE_PREFIX}${profileId}_${dataKey}`;
  localStorage.setItem(key, JSON.stringify(data));
};

const getProfileData = <T,>(profileId: string, dataKey: string, defaultValue?: T): T | undefined => {
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

const cleanupProfileData = (profileId: string) => {
  // Find and remove all localStorage items for this profile
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`${STORAGE_PREFIX}${profileId}_`)) {
      localStorage.removeItem(key);
    }
  });
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const storedProfiles = localStorage.getItem(`${STORAGE_PREFIX}profiles`);
    return storedProfiles ? JSON.parse(storedProfiles) : [defaultProfile];
  });
  
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(() => {
    const storedCurrentProfileId = localStorage.getItem(`${STORAGE_PREFIX}currentProfileId`);
    const storedProfiles = localStorage.getItem(`${STORAGE_PREFIX}profiles`);
    const parsedProfiles = storedProfiles ? JSON.parse(storedProfiles) : [defaultProfile];
    return parsedProfiles.find((p: Profile) => p.id === storedCurrentProfileId) || parsedProfiles[0];
  });

  const [isProfileSelectorOpen, setProfileSelectorOpen] = useState(false);
  
  // Save profiles and current profile to localStorage
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(`${STORAGE_PREFIX}profiles`, JSON.stringify(profiles));
    }
    
    if (currentProfile) {
      localStorage.setItem(`${STORAGE_PREFIX}currentProfileId`, currentProfile.id);
    }
  }, [profiles, currentProfile]);
  
  // Nueva función para eliminar todos los datos en memoria excepto los del perfil seleccionado
  const resetAllProfileDataOnLoad = (excludeProfileId?: string) => {
    // Limpiar todos los datos del contexto de contabilidad e inventarios
    // Esta función se llama cuando se cambia de perfil para evitar mezclar datos
    console.log("Resetting all data for profile switch, preserving profile:", excludeProfileId);

    // Aquí no eliminamos nada de localStorage, solo notificamos que se debe reiniciar los estados
    // Cada hook debería escuchar este evento para reiniciar su estado
    window.dispatchEvent(new CustomEvent('profile-changed', { 
      detail: { newProfileId: excludeProfileId }
    }));
  };
  
  const addProfile = (profileData: Omit<Profile, "id">) => {
    const newProfile = {
      ...profileData,
      id: uuidv4(),
      lastActive: new Date(),
    };
    
    setProfiles([...profiles, newProfile]);
    toast({
      title: "Perfil creado",
      description: `El perfil "${newProfile.name}" ha sido creado con éxito.`
    });
    
    return newProfile;
  };
  
  const selectProfile = (profileId: string, password?: string) => {
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) {
      toast({
        title: "Error",
        description: "Perfil no encontrado.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check password if the profile has one
    if (profile.hasPassword && profile.password !== password) {
      toast({
        title: "Error",
        description: "Contraseña incorrecta.",
        variant: "destructive"
      });
      return false;
    }
    
    // Importante: Primero limpiar los datos actuales antes de cambiar de perfil
    resetAllProfileDataOnLoad(profileId);
    
    // Update last active timestamp
    const updatedProfile = {
      ...profile,
      lastActive: new Date()
    };
    
    setProfiles(profiles.map(p => 
      p.id === profileId ? updatedProfile : p
    ));
    
    setCurrentProfile(updatedProfile);
    toast({
      title: "Perfil cambiado",
      description: `Ahora estás usando el perfil "${profile.name}".`
    });
    setProfileSelectorOpen(false);
    return true;
  };
  
  const updateProfile = (updatedProfile: Profile) => {
    setProfiles(profiles.map(p => 
      p.id === updatedProfile.id ? updatedProfile : p
    ));
    
    // If we're updating the current profile, update it too
    if (currentProfile?.id === updatedProfile.id) {
      setCurrentProfile(updatedProfile);
    }
    
    toast({
      title: "Perfil actualizado",
      description: `El perfil "${updatedProfile.name}" ha sido actualizado.`
    });
  };
  
  const deleteProfile = (profileId: string) => {
    // Don't allow deleting the last profile
    if (profiles.length <= 1) {
      toast({
        title: "Error",
        description: "No puedes eliminar el último perfil.",
        variant: "destructive"
      });
      return;
    }
    
    // If deleting current profile, switch to another one
    if (currentProfile?.id === profileId) {
      const otherProfile = profiles.find(p => p.id !== profileId);
      if (otherProfile) {
        setCurrentProfile(otherProfile);
      }
    }
    
    const profileToDelete = profiles.find(p => p.id === profileId);
    setProfiles(profiles.filter(p => p.id !== profileId));
    
    // Clean up all profile data from localStorage
    cleanupProfileData(profileId);
    
    toast({
      title: "Perfil eliminado",
      description: profileToDelete 
        ? `El perfil "${profileToDelete.name}" ha sido eliminado.`
        : "El perfil ha sido eliminado."
    });
  };
  
  const exportProfileData = (profileId: string) => {
    // Find all localStorage items for this profile
    const exportData: Record<string, any> = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`${STORAGE_PREFIX}${profileId}_`)) {
        const dataKey = key.replace(`${STORAGE_PREFIX}${profileId}_`, "");
        try {
          exportData[dataKey] = JSON.parse(localStorage.getItem(key) || "null");
        } catch (e) {
          console.error(`Error parsing data for export (${key}):`, e);
        }
      }
    });
    
    // Create a download link for the exported data
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const profileName = profiles.find(p => p.id === profileId)?.name || "perfil";
    const exportFileName = `${profileName.replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    toast({
      title: "Exportación completada",
      description: `Los datos del perfil "${profileName}" han sido exportados.`
    });
  };
  
  const importProfileData = (data: string, profileId: string) => {
    try {
      const importData = JSON.parse(data);
      
      // Store each key in the imported data
      Object.entries(importData).forEach(([key, value]) => {
        saveProfileData(profileId, key, value);
      });
      
      toast({
        title: "Importación completada",
        description: "Los datos han sido importados correctamente."
      });
      
      // Recargar los datos del perfil actual si es el mismo
      if (currentProfile?.id === profileId) {
        resetAllProfileDataOnLoad(profileId);
      }
    } catch (e) {
      console.error("Error importing data:", e);
      toast({
        title: "Error de importación",
        description: "El formato del archivo no es válido.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        addProfile,
        selectProfile,
        updateProfile,
        deleteProfile,
        exportProfileData,
        importProfileData,
        isProfileSelectorOpen,
        setProfileSelectorOpen,
        saveProfileData: (profileId, dataKey, data) => saveProfileData(profileId, dataKey, data),
        getProfileData: <T,>(profileId: string, dataKey: string, defaultValue?: T) => 
          getProfileData<T>(profileId, dataKey, defaultValue),
        resetAllProfileDataOnLoad
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

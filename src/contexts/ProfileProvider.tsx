
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Profile } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";
import { ProfileContext } from "./ProfileContext";
import { ProfileContextType, ProfileProviderProps, defaultProfile } from "./ProfileContextTypes";
import { STORAGE_PREFIX, saveProfileData, getProfileData, cleanupProfileData } from "@/utils/profile-storage";

export function ProfileProvider({ children }: ProfileProviderProps) {
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
  
  const resetAllProfileDataOnLoad = (excludeProfileId?: string) => {
    console.log("Resetting all data for profile switch, preserving profile:", excludeProfileId);

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
    
    if (profile.hasPassword && profile.password !== password) {
      toast({
        title: "Error",
        description: "Contraseña incorrecta.",
        variant: "destructive"
      });
      return false;
    }
    
    resetAllProfileDataOnLoad(profileId);
    
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
    
    if (currentProfile?.id === updatedProfile.id) {
      setCurrentProfile(updatedProfile);
    }
    
    toast({
      title: "Perfil actualizado",
      description: `El perfil "${updatedProfile.name}" ha sido actualizado.`
    });
  };
  
  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      toast({
        title: "Error",
        description: "No puedes eliminar el último perfil.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentProfile?.id === profileId) {
      const otherProfile = profiles.find(p => p.id !== profileId);
      if (otherProfile) {
        setCurrentProfile(otherProfile);
      }
    }
    
    const profileToDelete = profiles.find(p => p.id === profileId);
    setProfiles(profiles.filter(p => p.id !== profileId));
    
    cleanupProfileData(profileId);
    
    toast({
      title: "Perfil eliminado",
      description: profileToDelete 
        ? `El perfil "${profileToDelete.name}" ha sido eliminado.`
        : "El perfil ha sido eliminado."
    });
  };
  
  const exportProfileData = (profileId: string) => {
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
      
      Object.entries(importData).forEach(([key, value]) => {
        saveProfileData(profileId, key, value);
      });
      
      toast({
        title: "Importación completada",
        description: "Los datos han sido importados correctamente."
      });
      
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
  
  const contextValue: ProfileContextType = {
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
    saveProfileData,
    getProfileData,
    resetAllProfileDataOnLoad
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

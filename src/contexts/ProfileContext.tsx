
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Profile } from "@/types/profile";
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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Default profile
const defaultProfile: Profile = {
  id: "default",
  name: "Mi Empresa",
  currency: "MXN",
  iconName: "building",
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const storedProfiles = localStorage.getItem("accounting-profiles");
    return storedProfiles ? JSON.parse(storedProfiles) : [defaultProfile];
  });
  
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(() => {
    const storedCurrentProfileId = localStorage.getItem("accounting-current-profile");
    const storedProfiles = localStorage.getItem("accounting-profiles");
    const parsedProfiles = storedProfiles ? JSON.parse(storedProfiles) : [defaultProfile];
    return parsedProfiles.find((p: Profile) => p.id === storedCurrentProfileId) || parsedProfiles[0];
  });

  const [isProfileSelectorOpen, setProfileSelectorOpen] = useState(false);
  
  // Save profiles and current profile to localStorage
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem("accounting-profiles", JSON.stringify(profiles));
    }
    
    if (currentProfile) {
      localStorage.setItem("accounting-current-profile", currentProfile.id);
    }
  }, [profiles, currentProfile]);
  
  const addProfile = (profileData: Omit<Profile, "id">) => {
    const newProfile = {
      ...profileData,
      id: uuidv4(),
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
    
    setCurrentProfile(profile);
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
    
    toast({
      title: "Perfil eliminado",
      description: profileToDelete 
        ? `El perfil "${profileToDelete.name}" ha sido eliminado.`
        : "El perfil ha sido eliminado."
    });
  };
  
  const exportProfileData = (profileId: string) => {
    // This would need to be implemented with actual data export logic
    toast({
      title: "Exportación",
      description: "Funcionalidad de exportación no implementada aún."
    });
  };
  
  const importProfileData = (data: string, profileId: string) => {
    // This would need to be implemented with actual data import logic
    toast({
      title: "Importación",
      description: "Funcionalidad de importación no implementada aún."
    });
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
        setProfileSelectorOpen
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

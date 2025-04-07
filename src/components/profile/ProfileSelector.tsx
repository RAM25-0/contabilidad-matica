
import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import { ProfileForm } from "./ProfileForm";
import { PasswordDialog } from "./PasswordDialog";

export function ProfileSelector() {
  const { 
    profiles, 
    currentProfile, 
    selectProfile,
    isProfileSelectorOpen, 
    setProfileSelectorOpen 
  } = useProfile();

  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const handleProfileSelect = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile?.hasPassword) {
      setSelectedProfileId(profileId);
      setShowPasswordDialog(true);
    } else {
      selectProfile(profileId);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    if (selectedProfileId) {
      const success = selectProfile(selectedProfileId, password);
      if (success) {
        setShowPasswordDialog(false);
      }
    }
  };

  return (
    <>
      <Dialog open={isProfileSelectorOpen} onOpenChange={setProfileSelectorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Seleccionar Perfil</DialogTitle>
          </DialogHeader>
          
          {showNewProfileForm ? (
            <ProfileForm onCancel={() => setShowNewProfileForm(false)} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profiles.map(profile => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    isActive={currentProfile?.id === profile.id}
                    onClick={() => handleProfileSelect(profile.id)}
                  />
                ))}
                
                <Button
                  variant="outline"
                  className="h-32 border-dashed flex flex-col items-center justify-center gap-2"
                  onClick={() => setShowNewProfileForm(true)}
                >
                  <Plus className="h-6 w-6" />
                  <span>Nuevo Perfil</span>
                </Button>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setProfileSelectorOpen(false)}>
                  Cerrar
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración de Perfiles
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <PasswordDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog} 
        onSubmit={handlePasswordSubmit} 
      />
    </>
  );
}

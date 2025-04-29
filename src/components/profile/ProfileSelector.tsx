
import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Download, Upload } from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import { ProfileForm } from "./ProfileForm";
import { PasswordDialog } from "./PasswordDialog";
import { format } from "date-fns";

export function ProfileSelector() {
  const { 
    profiles, 
    currentProfile, 
    selectProfile,
    isProfileSelectorOpen, 
    setProfileSelectorOpen,
    exportProfileData,
    importProfileData 
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

  const handleImportClick = (profileId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          importProfileData(content, profileId);
        }
      };
      reader.readAsText(file);
    };
    input.click();
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profiles.map(profile => (
                  <div key={profile.id} className="space-y-1">
                    <ProfileCard
                      profile={profile}
                      isActive={currentProfile?.id === profile.id}
                      onClick={() => handleProfileSelect(profile.id)}
                    />
                    {profile.lastActive && (
                      <div className="text-xs text-muted-foreground px-2">
                        Último acceso: {format(new Date(profile.lastActive), 'dd/MM/yyyy HH:mm')}
                      </div>
                    )}
                    
                    <div className="flex gap-2 px-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 text-xs h-7"
                        onClick={() => exportProfileData(profile.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Exportar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 text-xs h-7"
                        onClick={() => handleImportClick(profile.id)}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Importar
                      </Button>
                    </div>
                  </div>
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

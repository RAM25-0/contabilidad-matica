import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InitialInventorySection } from "./InitialInventorySection";
import { PurchasesSection } from "./PurchasesSection";
import { RawMaterialSummary } from "./RawMaterialSummary";
import { RawMaterialState, initialRawMaterialState } from "./types";
import { Layers } from "lucide-react";
import { getProfileData, saveProfileData } from "@/utils/profile-storage";
import { useProfile } from "@/contexts/ProfileContext";

export function RawMaterialBlock() {
  const { currentProfile } = useProfile();
  const [state, setState] = useState<RawMaterialState>(initialRawMaterialState);

  // Load state from storage
  useEffect(() => {
    if (currentProfile?.id) {
      const savedState = getProfileData<RawMaterialState>(
        currentProfile.id,
        'production-raw-material'
      );
      if (savedState) {
        setState(savedState);
      }
    }
  }, [currentProfile?.id]);

  // Save state to storage
  useEffect(() => {
    if (currentProfile?.id) {
      saveProfileData(currentProfile.id, 'production-raw-material', state);
    }
  }, [state, currentProfile?.id]);

  const handleChange = (updates: Partial<RawMaterialState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Materia Prima (M.P.)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <InitialInventorySection state={state} onChange={handleChange} />
        <PurchasesSection state={state} onChange={handleChange} />
        <RawMaterialSummary state={state} />
      </CardContent>
    </Card>
  );
}

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

  useEffect(() => {
    if (currentProfile?.id) {
      saveProfileData(currentProfile.id, 'production-raw-material', state);
    }
  }, [state, currentProfile?.id]);

  const handleChange = (updates: Partial<RawMaterialState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="border-b border-border/40 bg-card pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-medium">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-4.5 w-4.5 text-primary" />
          </div>
          <span>Materia Prima (M.P.)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <InitialInventorySection state={state} onChange={handleChange} />
        <PurchasesSection state={state} onChange={handleChange} />
        <RawMaterialSummary state={state} />
      </CardContent>
    </Card>
  );
}

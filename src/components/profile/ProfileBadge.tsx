
import React from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { Building2, Briefcase, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileBadge() {
  const { currentProfile, setProfileSelectorOpen } = useProfile();

  if (!currentProfile) {
    return null;
  }

  const getIcon = () => {
    switch (currentProfile.iconName) {
      case "user":
        return <User className="h-4 w-4" />;
      case "briefcase":
        return <Briefcase className="h-4 w-4" />;
      case "building":
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-1 h-8 px-2 bg-background/50",
      )}
      onClick={() => setProfileSelectorOpen(true)}
    >
      <span className="flex items-center gap-1">
        {getIcon()}
        <span className="font-medium text-sm">{currentProfile.name}</span>
      </span>
      <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </Button>
  );
}

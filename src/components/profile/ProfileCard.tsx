
import React from "react";
import { Profile } from "@/types/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Briefcase, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profile: Profile;
  isActive: boolean;
  onClick: () => void;
}

export function ProfileCard({ profile, isActive, onClick }: ProfileCardProps) {
  const getIcon = () => {
    switch (profile.iconName) {
      case "user":
        return <User className="h-6 w-6" />;
      case "briefcase":
        return <Briefcase className="h-6 w-6" />;
      case "building":
      default:
        return <Building2 className="h-6 w-6" />;
    }
  };

  return (
    <Card 
      className={cn(
        "h-32 cursor-pointer transition-all hover:shadow-md",
        isActive && "border-primary ring-1 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-full space-y-2 p-4">
        <div className="rounded-full bg-muted p-3">
          {getIcon()}
        </div>
        <div className="text-center truncate w-full">
          <p className="font-medium truncate">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{profile.currency}</p>
        </div>
        {profile.hasPassword && (
          <Lock className="h-4 w-4 text-muted-foreground absolute top-2 right-2" />
        )}
      </CardContent>
    </Card>
  );
}

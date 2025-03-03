
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";

interface JournalLayoutProps {
  children: ReactNode;
}

export function JournalLayout({ children }: JournalLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {children}
      </div>
    </div>
  );
}

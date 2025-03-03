
import React, { useState, useEffect } from "react";
import { useAccounting } from "@/contexts/AccountingContext";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { JournalTabs } from "@/components/journal/JournalTabs";
import { JournalLayout } from "@/components/journal/JournalLayout";
import { JournalList } from "@/components/journal/JournalList";

export default function JournalPage() {
  const { state } = useAccounting();
  const [activeTab, setActiveTab] = useState("register");

  // Log transactions to console for debugging
  useEffect(() => {
    console.info("Journal Page - Current transactions:", state.transactions.length);
  }, [state.transactions]);

  return (
    <JournalLayout>
      <JournalHeader />
      <JournalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "history" && (
        <div className="mt-4">
          <JournalList />
        </div>
      )}
    </JournalLayout>
  );
}

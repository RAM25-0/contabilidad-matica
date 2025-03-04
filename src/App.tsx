
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AccountingProvider } from "@/contexts/AccountingContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import IndexPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { LedgerPage } from "@/pages/LedgerPage";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="accounting-theme">
      <AccountingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/ledger/:accountId" element={<LedgerPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
        </Router>
        <Toaster />
      </AccountingProvider>
    </ThemeProvider>
  );
}

export default App;

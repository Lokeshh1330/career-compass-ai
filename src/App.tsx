import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Analyze from "./pages/Analyze";
import ATSScore from "./pages/ATSScore";
import Companies from "./pages/Companies";
import Roadmap from "./pages/Roadmap";
import Auth from "./pages/Auth";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import CompanyResources from "./pages/CompanyResources";
import RoadmapStep from "./pages/RoadmapStep";
import MockTest from "./pages/MockTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ats-score" element={<ATSScore />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id/resources" element={<CompanyResources />} />
                <Route path="/roadmap/steps/:id" element={<RoadmapStep />} />
                <Route path="/mock-tests/:id" element={<MockTest />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="text-center text-sm text-gray-500 py-4">
              © 2026 Patent & Copyrights owned by M.Lokesh, P.Nikitha, Akhil. All rights reserved.
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

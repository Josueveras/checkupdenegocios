
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import NovoDiagnostico from "./pages/NovoDiagnostico";
import Diagnosticos from "./pages/Diagnosticos";
import Acompanhamento from "./pages/Acompanhamento";
import Propostas from "./pages/Propostas";
import MeusPlanos from "./pages/MeusPlanos";
import Perguntas from "./pages/Perguntas";
import Metricas from "./pages/Metricas";
import Onboarding from "./pages/Onboarding";
import Configuracoes from "./pages/Configuracoes";
import Conta from "./pages/Conta";
import NotFound from "./pages/NotFound";

// Novas páginas que serão criadas
import EditorPerguntas from "./pages/EditorPerguntas";
import Personalizacao from "./pages/Personalizacao";
import Integracoes from "./pages/Integracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gray-50">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/novo-diagnostico" element={<NovoDiagnostico />} />
                  <Route path="/diagnosticos" element={<Diagnosticos />} />
                  <Route path="/acompanhamento" element={<Acompanhamento />} />
                  <Route path="/propostas" element={<Propostas />} />
                  <Route path="/meus-planos" element={<MeusPlanos />} />
                  <Route path="/editor-perguntas" element={<EditorPerguntas />} />
                  <Route path="/metricas" element={<Metricas />} />
                  <Route path="/personalizacao" element={<Personalizacao />} />
                  <Route path="/integracoes" element={<Integracoes />} />
                  <Route path="/configuracoes" element={<Configuracoes />} />
                  <Route path="/conta" element={<Conta />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/perguntas" element={<Perguntas />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

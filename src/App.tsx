console.log("forçar rebuild Lovable");

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { FloatingMobileMenu } from "@/components/layout/FloatingMobileMenu";

// Pages
import Dashboard from "./pages/Dashboard";
import NovoDiagnostico from "./pages/NovoDiagnostico";
import Diagnosticos from "./pages/Diagnosticos";
import DiagnosticoView from "./pages/DiagnosticoView";
import Acompanhamento from "./pages/Acompanhamento";
import ResultadoAcompanhamento from "./pages/ResultadoAcompanhamento";
import EvolucaoCliente from "./pages/EvolucaoCliente";
import EvolucaoClienteDetalhada from "./pages/EvolucaoClienteDetalhada";
import EmpresaDetalhada from "./pages/EmpresaDetalhada";
import EmpresaVisaoGeral from "./pages/EmpresaVisaoGeral";
import Empresas from "./pages/Empresas";
import Propostas from "./pages/Propostas";
import EditarProposta from "./pages/EditarProposta";
import NovoCheckup from "./pages/NovoCheckup";
import Planos from "./pages/Planos";
import Perguntas from "./pages/Perguntas";
import Metricas from "./pages/Metricas";
import Configuracoes from "./pages/Configuracoes";
import Conta from "./pages/Conta";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Sidebar apenas no desktop */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto pb-20 md:pb-6">
            {children}
          </main>
        </div>
        
        {/* Menu mobile fixo na parte inferior */}
        <FloatingMobileMenu />
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <AppLayout><Dashboard /></AppLayout>
          } />
          <Route path="/novo-diagnostico" element={
            <AppLayout><NovoDiagnostico /></AppLayout>
          } />
          <Route path="/diagnosticos" element={
            <AppLayout><Diagnosticos /></AppLayout>
          } />
          <Route path="/diagnostico-view" element={
            <AppLayout><DiagnosticoView /></AppLayout>
          } />
          <Route path="/acompanhamento" element={
            <AppLayout><Acompanhamento /></AppLayout>
          } />
          <Route path="/acompanhamento/resultado/:id" element={
            <AppLayout><ResultadoAcompanhamento /></AppLayout>
          } />
          <Route path="/empresa/:id" element={
            <AppLayout><EmpresaDetalhada /></AppLayout>
          } />
          <Route path="/empresa-visao/:id" element={
  <AppLayout><EmpresaVisaoGeral /></AppLayout>
} />

          <Route path="/clientes/:id" element={
            <AppLayout><EvolucaoClienteDetalhada /></AppLayout>
          } />
          <Route path="/empresas" element={
            <AppLayout><Empresas /></AppLayout>
          } />
          <Route path="/propostas" element={
            <AppLayout><Propostas /></AppLayout>
          } />
          <Route path="/editar-proposta" element={
            <AppLayout><EditarProposta /></AppLayout>
          } />
          <Route path="/checkup/novo" element={
            <AppLayout><NovoCheckup /></AppLayout>
          } />
          <Route path="/planos" element={
            <AppLayout><Planos /></AppLayout>
          } />
          <Route path="/perguntas" element={
            <AppLayout><Perguntas /></AppLayout>
          } />
          <Route path="/metricas" element={
            <AppLayout><Metricas /></AppLayout>
          } />
          <Route path="/configuracoes" element={
            <AppLayout><Configuracoes /></AppLayout>
          } />
          <Route path="/conta" element={
            <AppLayout><Conta /></AppLayout>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

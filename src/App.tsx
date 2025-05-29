
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Dashboard from "./pages/Dashboard";
import NovoDiagnostico from "./pages/NovoDiagnostico";
import Diagnosticos from "./pages/Diagnosticos";
import Acompanhamento from "./pages/Acompanhamento";
import Propostas from "./pages/Propostas";
import Planos from "./pages/Planos";
import Perguntas from "./pages/Perguntas";
import Metricas from "./pages/Metricas";
import Onboarding from "./pages/Onboarding";
import Configuracoes from "./pages/Configuracoes";
import Conta from "./pages/Conta";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/novo-diagnostico" element={
              <ProtectedRoute>
                <AppLayout><NovoDiagnostico /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/diagnosticos" element={
              <ProtectedRoute>
                <AppLayout><Diagnosticos /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/acompanhamento" element={
              <ProtectedRoute>
                <AppLayout><Acompanhamento /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/propostas" element={
              <ProtectedRoute>
                <AppLayout><Propostas /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/planos" element={
              <ProtectedRoute>
                <AppLayout><Planos /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/perguntas" element={
              <ProtectedRoute>
                <AppLayout><Perguntas /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/metricas" element={
              <ProtectedRoute>
                <AppLayout><Metricas /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <AppLayout><Onboarding /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <AppLayout><Configuracoes /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/conta" element={
              <ProtectedRoute>
                <AppLayout><Conta /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

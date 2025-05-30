
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "📊"
  },
  {
    title: "Novo Diagnóstico",
    url: "/novo-diagnostico",
    icon: "➕"
  },
  {
    title: "Diagnósticos",
    url: "/diagnosticos",
    icon: "📋"
  },
  {
    title: "Acompanhamento",
    url: "/acompanhamento",
    icon: "📅"
  },
  {
    title: "Propostas",
    url: "/propostas",
    icon: "📄"
  },
  {
    title: "Perguntas",
    url: "/perguntas",
    icon: "❓"
  },
  {
    title: "Métricas",
    url: "/metricas",
    icon: "📈"
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: "⚙️"
  },
  {
    title: "Conta",
    url: "/conta",
    icon: "👤"
  }
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Botão do menu - fixado no canto superior direito */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 bg-white shadow-md hover:bg-gray-50"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-in fade-in-0"
          onClick={closeMenu}
        />
      )}

      {/* Menu flutuante */}
      {isOpen && (
        <div className="fixed top-20 right-4 left-4 z-50 animate-in slide-in-from-top-2 fade-in-0 duration-200">
          <div className="bg-white rounded-xl shadow-xl p-4 space-y-3 max-w-sm mx-auto">
            {/* Header do menu */}
            <div className="pb-2 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">CheckUp de Negócios</h3>
            </div>

            {/* Itens do menu */}
            <div className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm",
                    isActive(item.url)
                      ? "bg-primary text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

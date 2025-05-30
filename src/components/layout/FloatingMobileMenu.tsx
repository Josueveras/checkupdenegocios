
import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, FileText, Calendar, Settings, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home
  },
  {
    title: "Novo",
    url: "/novo-diagnostico",
    icon: Plus
  },
  {
    title: "Diagnósticos",
    url: "/diagnosticos",
    icon: FileText
  },
  {
    title: "Acompanhamento",
    url: "/acompanhamento",
    icon: Calendar
  },
  {
    title: "Métricas",
    url: "/metricas",
    icon: BarChart
  },
  {
    title: "Config",
    url: "/configuracoes",
    icon: Settings
  }
];

export function FloatingMobileMenu() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname === path;

  // Não renderizar se não for mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive(item.url)
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mb-1",
                isActive(item.url) ? "text-primary" : "text-gray-500"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive(item.url) ? "text-primary" : "text-gray-500"
              )}>
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

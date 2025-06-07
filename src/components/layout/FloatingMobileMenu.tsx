
import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, FileText, Calendar, Settings, BarChart, Users, ClipboardList, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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
    title: "Propostas",
    url: "/propostas",
    icon: ClipboardList
  },
  {
    title: "Planos",
    url: "/planos",
    icon: Target
  },
  {
    title: "Perguntas",
    url: "/perguntas",
    icon: Users
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
      <div className="px-2 py-2">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <CarouselItem key={item.title} className="pl-2 basis-auto">
                  <NavLink
                    to={item.url}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-w-[70px]",
                      isActive(item.url)
                        ? "text-primary bg-primary/10"
                        : "text-gray-500 hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 mb-1",
                      isActive(item.url) ? "text-primary" : "text-gray-500"
                    )} />
                    <span className={cn(
                      "text-xs font-medium text-center leading-tight",
                      isActive(item.url) ? "text-primary" : "text-gray-500"
                    )}>
                      {item.title}
                    </span>
                  </NavLink>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

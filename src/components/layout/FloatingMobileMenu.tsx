
import { useState, useEffect, useRef } from "react";
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
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Carregar posição salva do localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('floating-menu-position');
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (error) {
        console.warn('Erro ao carregar posição do menu:', error);
      }
    }
  }, []);

  // Salvar posição no localStorage
  const savePosition = (newPosition: { x: number; y: number }) => {
    localStorage.setItem('floating-menu-position', JSON.stringify(newPosition));
  };

  // Handlers para touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    
    if (menuRef.current) {
      menuRef.current.style.cursor = 'grabbing';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isMobile) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Limitar às bordas da tela
    const maxX = window.innerWidth - (menuRef.current?.offsetWidth || 200);
    const maxY = window.innerHeight - (menuRef.current?.offsetHeight || 300);
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    
    setIsDragging(false);
    savePosition(position);
    
    if (menuRef.current) {
      menuRef.current.style.cursor = 'grab';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Não renderizar se não for mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-[9999] select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header do menu */}
      <div className="text-center mb-3 pb-2 border-b border-gray-100">
        <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
        <span className="text-xs font-medium text-gray-600">Menu</span>
      </div>

      {/* Grid de ícones */}
      <div className="grid grid-cols-3 gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 text-xs min-h-[60px]",
                isActive(item.url)
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary"
              )}
              onTouchStart={(e) => e.stopPropagation()} // Evitar arrastar ao clicar no link
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Indicador visual do drag */}
      {isDragging && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-xl border-2 border-primary border-dashed pointer-events-none"></div>
      )}
    </div>
  );
}


import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  BarChart3, 
  Settings, 
  Users, 
  Presentation,
  HelpCircle,
  Calendar,
  CreditCard,
  Building2
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const AppSidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Diagnósticos', href: '/diagnosticos' },
    { icon: Presentation, label: 'Propostas', href: '/propostas' },
    { icon: BarChart3, label: 'Métricas', href: '/metricas' },
    { icon: Calendar, label: 'Acompanhamento', href: '/acompanhamento' },
    { icon: HelpCircle, label: 'Perguntas', href: '/perguntas' },
    { icon: Building2, label: 'Identidade Visual', href: '/configuracoes' },
    { icon: Settings, label: 'Integrações', href: '/configuracoes' },
    { icon: CreditCard, label: 'Planos', href: '/planos' },
    { icon: Users, label: 'Minha Conta', href: '/conta' }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30",
      isOpen ? "w-64" : "w-0 overflow-hidden"
    )}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-100 hover:text-petrol hover:translate-x-1",
                  active 
                    ? "bg-petrol/10 text-petrol border-r-2 border-petrol" 
                    : "text-gray-700"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-petrol" : "text-gray-500"
                )} />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-petrol rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">CheckUp de Negócios</p>
          <p className="text-xs text-gray-400">Versão 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;

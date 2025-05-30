
import { Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import { BackButton } from "@/components/ui/back-button";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  
  // Mostrar botão voltar em páginas específicas que não sejam o dashboard
  const showBackButton = location.pathname !== '/dashboard' && 
                         !location.pathname.startsWith('/diagnosticos') &&
                         !location.pathname.startsWith('/propostas') &&
                         !location.pathname.startsWith('/planos') &&
                         !location.pathname.startsWith('/perguntas');
  
  // Mostrar o trigger apenas quando o sidebar estiver recolhido
  const showSidebarTrigger = state === "collapsed";

  const handleBackClick = () => {
    // Para páginas de edição, voltar para a página de listagem correspondente
    if (location.pathname.includes('/novo-diagnostico')) {
      navigate('/diagnosticos');
    } else if (location.pathname.includes('/editar-proposta')) {
      navigate('/propostas');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {showSidebarTrigger && <SidebarTrigger />}
        {showBackButton && <BackButton onClick={handleBackClick} />}
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-900">
            CheckUp de Negócios
          </h1>
          <p className="text-sm text-gray-500">
            Diagnósticos empresariais inteligentes
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Usuário" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Usuário</p>
                <p className="text-xs leading-none text-muted-foreground">
                  usuario@exemplo.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

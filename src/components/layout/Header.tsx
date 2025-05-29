
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Simular algumas notificações para demonstração
  const mockNotifications = [
    {
      id: 1,
      title: "Novo diagnóstico concluído",
      description: "Tech Solutions LTDA - Score: 78%",
      time: "5 min atrás",
      unread: true
    },
    {
      id: 2,
      title: "Proposta aprovada",
      description: "Marketing Digital Pro - R$ 15.000",
      time: "1h atrás",
      unread: true
    },
    {
      id: 3,
      title: "Reunião agendada",
      description: "Inovação & Estratégia - Amanhã às 14h",
      time: "2h atrás",
      unread: false
    }
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  // Extrair apenas o primeiro nome do usuário
  const getDisplayName = () => {
    if (user?.email) {
      const name = user.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Usuário';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Back Button */}
          {location.pathname !== '/dashboard' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}

          {/* Logo - Clickable */}
          <button
            onClick={handleLogoClick}
            className="text-xl font-bold text-petrol hover:text-petrol/80 transition-colors cursor-pointer"
          >
            CheckUp de Negócios
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotificationsClick}
              className="relative hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Notifications Panel */}
            {showNotifications && (
              <Card className="absolute right-0 top-12 w-80 shadow-lg z-50 border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Notificações</CardTitle>
                  <CardDescription>
                    Você tem {unreadCount} notificações não lidas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                        notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                          <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver todas as notificações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-petrol text-white">
                    {getDisplayName().charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">
                  {getDisplayName()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/conta" className="cursor-pointer">
                  Minha Conta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes" className="cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Overlay para fechar notificações */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default Header;


import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'diagnostic' | 'proposal' | 'system';
  pdfUrl?: string;
  read: boolean;
  createdAt: Date;
}

export function NotificationDropdown() {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Novo Diagnóstico',
      message: 'Diagnóstico da Tech Solutions foi concluído',
      type: 'diagnostic',
      pdfUrl: 'https://example.com/diagnostic1.pdf',
      read: false,
      createdAt: new Date(Date.now() - 60000) // 1 minuto atrás
    },
    {
      id: '2',
      title: 'Proposta Gerada',
      message: 'Proposta para Marketing Digital Pro está pronta',
      type: 'proposal',
      pdfUrl: 'https://example.com/proposal1.pdf',
      read: false,
      createdAt: new Date(Date.now() - 300000) // 5 minutos atrás
    },
    {
      id: '3',
      title: 'Sistema',
      message: 'Bem-vindo ao CheckUp de Negócios!',
      type: 'system',
      read: true,
      createdAt: new Date(Date.now() - 3600000) // 1 hora atrás
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.pdfUrl) {
      window.open(notification.pdfUrl, '_blank');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'agora';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <DropdownMenuLabel className="font-semibold">
          Notificações
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} nova{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>
            Nenhuma notificação
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`cursor-pointer p-3 ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex flex-col w-full space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{notification.title}</span>
                  <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                {notification.pdfUrl && (
                  <span className="text-xs text-blue-600">Clique para abrir PDF</span>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

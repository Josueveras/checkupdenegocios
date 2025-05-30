
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
import { useNotifications, useMarkAsRead } from '@/hooks/useNotifications';

export function NotificationDropdown() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();

  const unreadCount = notifications.filter(n => !n.lida).length;

  const handleNotificationClick = (notification: any) => {
    // Marcar como lida
    if (!notification.lida) {
      markAsRead.mutate(notification.id);
    }

    // Abrir PDF se existir
    if (notification.link_pdf) {
      window.open(notification.link_pdf, '_blank');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
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

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

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
              className={`cursor-pointer p-3 ${!notification.lida ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex flex-col w-full space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{notification.titulo}</span>
                  <span className="text-xs text-gray-500">{formatTime(notification.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600">{notification.descricao}</p>
                {notification.link_pdf && (
                  <span className="text-xs text-blue-600">Clique para abrir PDF</span>
                )}
                {!notification.lida && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

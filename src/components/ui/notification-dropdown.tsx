
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationDropdownProps {
  notifications?: Array<{
    id: number;
    title: string;
    description: string;
    time: string;
    unread: boolean;
  }>;
}

export const NotificationDropdown = ({ notifications = [] }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => n.unread).length;

  const defaultNotifications = [
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

  const notificationList = notifications.length > 0 ? notifications : defaultNotifications;
  const totalUnread = notifications.length > 0 ? unreadCount : defaultNotifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {totalUnread > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
          >
            {totalUnread}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <Card className="absolute right-0 top-12 w-80 shadow-lg z-50 border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notificações</CardTitle>
              <CardDescription>
                Você tem {totalUnread} notificações não lidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notificationList.map((notification) => (
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
          
          {/* Overlay para fechar notificações */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

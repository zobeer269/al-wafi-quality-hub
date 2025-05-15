
import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getNotifications, markNotificationAsRead, Notification, getUnreadNotificationsCount } from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      await markNotificationAsRead(notification.id);
      
      // Update local state to reflect the change
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
    
    // Navigate based on notification type
    if (notification.related_to === 'non_conformance') {
      navigate(`/nonconformance/details/${notification.related_id}`);
    } else if (notification.related_to === 'capa') {
      navigate(`/capa/details/${notification.related_id}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <div className="p-2 font-medium">Notifications</div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className="cursor-pointer focus:bg-muted p-0"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className={`p-2 flex items-start w-full ${!notification.read_at ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="font-medium text-sm truncate">{notification.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{notification.message}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>
                  {!notification.read_at && (
                    <div className="flex-shrink-0 ml-2 h-2 w-2 bg-blue-500 rounded-full mt-1" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center text-sm cursor-pointer"
              onClick={() => {
                // Here we could navigate to a full notification page
                // navigate('/notifications');
              }}
            >
              View all
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;

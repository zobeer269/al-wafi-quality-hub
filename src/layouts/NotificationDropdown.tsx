
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const NotificationDropdown = () => {
  // This would be fetched from a backend service in a real app
  const notifications = [
    { id: '1', title: 'New CAPA assigned', read: false },
    { id: '2', title: 'Document approval required', read: false },
    { id: '3', title: 'Training due next week', read: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className={notification.read ? 'opacity-70' : 'font-medium'}>
                <div className="flex items-start">
                  <div className={`w-2 h-2 mt-1.5 mr-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-primary'}`} />
                  <span>{notification.title}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium">
              View all
            </DropdownMenuItem>
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No new notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;

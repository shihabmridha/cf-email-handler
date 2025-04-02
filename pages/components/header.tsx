'use client';

import { Button } from '@/components/ui/button';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { IncomingHistoryDto } from '@/shared/dtos/incoming-history.dto';
import { apiClient } from '@/lib/api-client';
import { NotificationDetailModal } from './notification-detail-modal';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<IncomingHistoryDto[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<IncomingHistoryDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient.getIncomingHistory();
        setNotifications(data.histories);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification: IncomingHistoryDto) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">Email Platform</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h4 className="text-sm font-medium">Recent Notifications</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="text-sm font-medium break-words line-clamp-1">
                          {notification.subject}
                        </div>
                        <div className="text-xs text-muted-foreground break-words line-clamp-1">
                          From: {notification.fromEmail}
                        </div>
                        <div className="text-xs text-muted-foreground break-words line-clamp-1">
                          To: {notification.toEmail}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>
      <NotificationDetailModal
        notification={selectedNotification}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

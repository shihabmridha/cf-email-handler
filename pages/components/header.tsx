'use client';

import { Button } from '@/components/ui/button';
import { Bell, User, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { IncomingHistoryDto } from '@/shared/dtos/incoming-history';
import { apiClient } from '@/lib/api-client';
import { NotificationDetailModal } from './notification-detail-modal';
import { formatDateTime } from '../lib/utils/date';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<IncomingHistoryDto[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<IncomingHistoryDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient.getIncomingHistory();
        setNotifications(data.histories);
      } catch {
        // Silently fail to avoid noisy logs in UI; notifications are non-blocking
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification: IncomingHistoryDto) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleSeeMore = () => {
    router.push('/notifications');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight">Email Platform</h1>
          </div>
          <div className="flex items-center gap-1">
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
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium break-words line-clamp-1">
                              {notification.subject}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              From: {notification.fromEmail}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              To: {notification.toEmail}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDateTime(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="border-t bg-muted/20 p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSeeMore}
                      className="w-full justify-between text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      See all notifications
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
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

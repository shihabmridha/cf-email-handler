'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IncomingHistoryDto } from '@/shared/dtos/incoming-history';
import { Mail, User, Send, ArrowRight, Clock } from 'lucide-react';

interface NotificationDetailModalProps {
  notification: IncomingHistoryDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDetailModal({
  notification,
  open,
  onOpenChange,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold break-words">
            {notification.subject}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Date & Time
            </div>
            <div className="text-sm break-all bg-muted/50 p-3 rounded-md">
              {new Date(notification.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
              ,{' '}
              {new Date(notification.createdAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              From
            </div>
            <div className="text-sm break-all bg-muted/50 p-3 rounded-md">
              {notification.fromEmail}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mail className="h-4 w-4" />
              To
            </div>
            <div className="text-sm break-all bg-muted/50 p-3 rounded-md">
              {notification.toEmail}
            </div>
          </div>
          {notification.destination && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Send className="h-4 w-4" />
                Destination
              </div>
              <div className="text-sm break-all bg-muted/50 p-3 rounded-md">
                {notification.destination}
              </div>
            </div>
          )}
          {notification.summary && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                Summary
              </div>
              <div className="text-sm break-all whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                {notification.summary}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

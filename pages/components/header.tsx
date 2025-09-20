'use client';

import { Button } from '@/components/ui/button';
import { Clock, User, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { IncomingHistoryDto } from '@/shared/dtos/incoming-history';
import { apiClient } from '@/lib/api-client';
import { HistoryDetailModal } from './history-detail-modal';
import { formatDateTime } from '../lib/utils/date';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<IncomingHistoryDto[]>([]);
  const [selectedHistory, setSelectedHistory] =
    useState<IncomingHistoryDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiClient.getIncomingHistory();
        setHistoryItems(data.histories);
      } catch {
        // Silently fail to avoid noisy logs in UI; history is non-blocking
      }
    };

    fetchHistory();
  }, []);

  const handleHistoryClick = (history: IncomingHistoryDto) => {
    setSelectedHistory(history);
    setIsModalOpen(true);
  };

  const handleSeeMore = () => {
    router.push('/history');
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
                  <Clock className="h-4 w-4" />
                  <span className="sr-only">History</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h4 className="text-sm font-medium">Recent History</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {historyItems.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No history records
                    </div>
                  ) : (
                    historyItems.map((history) => (
                      <div
                        key={history.id}
                        className="p-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                        onClick={() => handleHistoryClick(history)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium break-words line-clamp-1">
                              {history.subject}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              From: {history.fromEmail}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              To: {history.toEmail}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDateTime(history.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {historyItems.length > 0 && (
                  <div className="border-t bg-muted/20 p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSeeMore}
                      className="w-full justify-between text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      See full history
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
      <HistoryDetailModal
        history={selectedHistory}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

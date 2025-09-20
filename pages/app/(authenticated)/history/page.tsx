'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IncomingHistoryDto } from '@/shared/dtos/incoming-history';
import { apiClient } from '@/lib/api-client';
import { HistoryDetailModal } from '@/components/history-detail-modal';
import { formatDateTime } from '@/lib/utils/date';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, User, Clock, RefreshCw } from 'lucide-react';

export default function HistoryPage() {
    const [historyEntries, setHistoryEntries] = useState<IncomingHistoryDto[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<IncomingHistoryDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchHistory = async (page: number = 1, append: boolean = false) => {
        try {
            if (!append) setLoading(true);
            else setIsLoadingMore(true);

            const data = await apiClient.getIncomingHistory(page);

            if (append) {
                setHistoryEntries(prev => [...prev, ...data.histories]);
            } else {
                setHistoryEntries(data.histories);
            }

            setError(null);
        } catch (err) {
            console.error('Failed to fetch history:', err);
            setError('Failed to load history');
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleHistoryClick = (history: IncomingHistoryDto) => {
        setSelectedHistory(history);
        setIsModalOpen(true);
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchHistory(nextPage, true);
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchHistory(1, false);
    };

    if (loading) {
        return (
            <div className="py-6 space-y-6">
                <PageHeader
                    title="History"
                    description="Review all incoming email history"
                    actions={
                        <Button variant="outline" disabled>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    }
                />
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <Skeleton className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-6 space-y-6">
                <PageHeader
                    title="History"
                    description="Review all incoming email history"
                    actions={
                        <Button variant="outline" onClick={handleRefresh}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    }
                />
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="p-6 text-center">
                        <div className="text-red-500 mb-4">{error}</div>
                        <Button onClick={handleRefresh}>Try Again</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="py-6 space-y-6">
                <PageHeader
                    title="History"
                    description="Review all incoming email history"
                    actions={
                        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    }
                />

                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                    <div className="max-h-[70vh] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-muted/30 backdrop-blur-md z-10">
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Received</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {historyEntries.map((history) => (
                                    <TableRow key={history.id}>
                                        <TableCell className="font-semibold text-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="truncate max-w-[200px]" title={history.subject}>
                                                    {history.subject}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate max-w-[150px]" title={history.fromEmail}>
                                                    {history.fromEmail}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate max-w-[150px]" title={history.toEmail}>
                                                    {history.toEmail}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {history.destination && (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted rounded-full">
                                                    {history.destination}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <time className="text-xs">
                                                    {formatDateTime(history.createdAt)}
                                                </time>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleHistoryClick(history)}
                                                    className="cursor-pointer"
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {historyEntries.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-12"
                                        >
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-sm font-medium text-foreground">No history records found</h3>
                                                    <p className="text-xs text-muted-foreground mt-1">When emails are received, they&apos;ll appear here</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {historyEntries.length > 0 && (
                        <div className="border-t bg-muted/20 p-4 flex justify-center">
                            <Button
                                variant="outline"
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="min-w-[120px]"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <HistoryDetailModal
                history={selectedHistory}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}

import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function HistoryLoading() {
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
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


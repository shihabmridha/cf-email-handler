'use client';

import { type ReactNode } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/class';

interface TableEmptyStateProps {
  colSpan: number;
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function TableEmptyState({
  colSpan,
  icon,
  title,
  description,
  className,
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className={cn('py-12 text-center', className)}>
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

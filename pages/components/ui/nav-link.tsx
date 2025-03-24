'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({
  href,
  icon: Icon,
  children,
  className,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center space-x-2 p-2 hover:bg-gray-200 rounded',
        isActive && 'bg-gray-200',
        className,
      )}
    >
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </Link>
  );
}

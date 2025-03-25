'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Mail, FileText, Route, Users, LogOut } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useEffect } from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const NavLink = ({ href, children, icon }: NavLinkProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href;

  // Prefetch the route on mount
  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
      prefetch={true}
    >
      {icon}
      {children}
    </Link>
  );
};

export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    apiClient.removeAuthToken();
    router.push('/home');
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-2">
          <NavLink href="/compose" icon={<Mail className="h-4 w-4" />}>
            Compose
          </NavLink>
          <NavLink href="/draft" icon={<FileText className="h-4 w-4" />}>
            Draft
          </NavLink>
          <NavLink href="/routes" icon={<Route className="h-4 w-4" />}>
            Routes
          </NavLink>
          <NavLink href="/providers" icon={<Users className="h-4 w-4" />}>
            Providers
          </NavLink>
        </div>
      </div>
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

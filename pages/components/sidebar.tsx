'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/class';
import { Button } from '@/components/ui/button';
import { Mail, FileText, Route, Users, LogOut, Settings, Bell } from 'lucide-react';
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

  const handleClick = () => {
    console.log('NavLink clicked:', href);
    router.push(href);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer select-none',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {icon}
      {children}
    </div>
  );
};

export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    apiClient.removeAuthToken();
    router.push('/home');
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background/60 backdrop-blur">
      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-3 pb-2">
          <div className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Navigation
          </div>
        </div>
        <div className="space-y-1 px-2">
          <NavLink href="/compose" icon={<Mail className="h-4 w-4" />}>
            Compose
          </NavLink>
          <NavLink href="/draft" icon={<FileText className="h-4 w-4" />}>
            Draft
          </NavLink>
          <NavLink href="/notifications" icon={<Bell className="h-4 w-4" />}>
            Notifications
          </NavLink>
          <NavLink href="/routes" icon={<Route className="h-4 w-4" />}>
            Routes
          </NavLink>
          <NavLink href="/providers" icon={<Users className="h-4 w-4" />}>
            Providers
          </NavLink>
          <NavLink href="/general" icon={<Settings className="h-4 w-4" />}>
            General
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

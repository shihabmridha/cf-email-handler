'use client';

import {
  Pencil,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Route,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NavLink } from '@/components/ui/nav-link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="w-64 bg-gray-100 h-full overflow-auto flex-shrink-0">
      <nav className="space-y-2">
        <NavLink href="/compose" icon={Pencil}>
          Compose
        </NavLink>
        <NavLink href="/draft" icon={FileText}>
          Draft
        </NavLink>
        <NavLink href="/routes" icon={Route}>
          Routes
        </NavLink>
        <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={cn(
              'flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded',
              pathname.startsWith('/settings') && 'bg-gray-200',
            )}
          >
            <div className="flex items-center space-x-2">
              <Settings size={20} />
              <span>Settings</span>
            </div>
            {settingsOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          {settingsOpen && (
            <div className="ml-4 mt-2 space-y-2">
              <NavLink href="/settings/general">General</NavLink>
              <NavLink href="/settings/mailtrap">Mailtrap</NavLink>
              <NavLink href="/settings/resend">Resend</NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

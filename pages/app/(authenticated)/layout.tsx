'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { apiClient } from '@/lib/api-client';
import ComposeLoading from './compose/loading';
import DraftLoading from './draft/loading';
import RoutesLoading from './routes/loading';
import ProvidersLoading from './providers/loading';

function getLoadingComponent(pathname: string) {
  switch (pathname) {
    case '/compose':
      return <ComposeLoading />;
    case '/draft':
      return <DraftLoading />;
    case '/routes':
      return <RoutesLoading />;
    case '/providers':
      return <ProvidersLoading />;
    default:
      return <ComposeLoading />;
  }
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await apiClient.isAuthenticated();
      if (!isAuthenticated) {
        router.push('/home');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <ComposeLoading />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <Suspense fallback={getLoadingComponent(pathname)}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { ProviderConfigDto } from '@/shared/dtos/provider';

export function useProviders() {
  const [providers, setProviders] = useState<ProviderConfigDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchProviders = async () => {
      try {
        const providers = await apiClient.getProviders();
        if (mounted) {
          setProviders(providers);
          setError(null);
        }
      } catch {
        if (mounted) {
          setError('Failed to load providers');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProviders();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    providers,
    loading,
    error
  };
}
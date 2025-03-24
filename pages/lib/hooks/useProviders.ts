'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { ProviderConfigDto } from '@/shared/dtos/provider';

export function useProviders() {
  const [providers, setProviders] = useState<ProviderConfigDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const fetchProviders = useCallback(async () => {
    let mounted = true;
    setLoading(true);

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

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchProviders();
      initialLoadDone.current = true;
    }
  }, [fetchProviders]);

  return {
    providers,
    loading,
    error
  };
}
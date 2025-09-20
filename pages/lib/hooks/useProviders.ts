'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';
import { ProviderConfigDto } from '@/shared/dtos/provider';

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Failed to load providers';
};

export function useProviders() {
  const [providers, setProviders] = useState<ProviderConfigDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextProviders = await apiClient.getProviders();
      setProviders(nextProviders);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProviders().catch(() => {
        // error state handled in fetchProviders
      });
      hasFetched.current = true;
    }
  }, [fetchProviders]);

  return {
    providers,
    loading,
    error,
    refresh: fetchProviders,
  };
}

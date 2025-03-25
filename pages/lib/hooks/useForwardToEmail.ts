import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/lib/api-client';

export function useForwardToEmail() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const fetchEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getForwardToEmail();
      setEmail(data.email);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchEmail();
      initialLoadDone.current = true;
    }
  }, [fetchEmail]);

  return { email, isLoading, error };
}

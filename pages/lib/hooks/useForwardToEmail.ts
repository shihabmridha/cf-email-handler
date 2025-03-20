import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/lib/api-client';

export function useForwardToEmail() {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEmail() {
            try {
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
        }

        fetchEmail();
    }, []);

    return { email, isLoading, error };
}

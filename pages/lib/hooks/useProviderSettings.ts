'use client';

import { useState, useEffect } from 'react';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { ProviderType } from '@/shared/enums/provider';
import { apiClient } from '@/lib/api-client';

export function useProviderSettings(type: ProviderType) {
  const [provider, setProvider] = useState<ProviderConfigDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchData = async () => {
      const provider = await apiClient.getProviderByType(type);
      if (mounted) {
        setProvider(provider);
      }
      if (mounted) {
        setLoading(false);
      }
    };

    fetchData().catch(() => {
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [type]);

  async function saveProvider(data: Partial<ProviderConfigDto>) {
    // Save the provider
    if (provider) {
      await apiClient.updateProvider(provider.id, data);
    } else {
      await apiClient.createProvider({
        name: `${ProviderType[type]} Provider`,
        type,
        domain: data.domain || '',
        userId: 0, // Will be set by backend
        enabled: true,
        ...data,
      });
    }

    // Refetch the provider data after successful save
    const updatedProvider = await apiClient.getProviderByType(type);
    setProvider(updatedProvider);
  }

  return {
    provider,
    loading,
    saveProvider,
  };
}


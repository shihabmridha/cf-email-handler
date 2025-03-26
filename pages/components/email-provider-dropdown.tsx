'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { ProviderConfigDto } from '@/shared/dtos/provider';

interface EmailProviderDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function EmailProviderDropdown({
  value,
  onChange,
}: EmailProviderDropdownProps) {
  const [providers, setProviders] = useState<ProviderConfigDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await apiClient.getProviders();
        setProviders(response);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px] cursor-pointer">
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="loading">Loading...</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] cursor-pointer">
        <SelectValue placeholder="Select Provider" />
      </SelectTrigger>
      <SelectContent>
        {providers.map((provider) => (
          <SelectItem key={provider.id} value={provider.id.toString()}>
            {provider.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

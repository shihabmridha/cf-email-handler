'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { useToast } from '@/components/ui/use-toast';

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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const toastRef = useRef(toast);
  const isMountedRef = useRef(false);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchProviders = async () => {
      try {
        const response = await apiClient.getProviders();
        if (!isMountedRef.current) {
          return;
        }
        setProviders(response);
        setError(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load providers';
        if (isMountedRef.current) {
          setError(message);
        }
        toastRef.current({
          title: 'Unable to load providers',
          description: message,
          variant: 'destructive',
        });
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchProviders();

    return () => {
      isMountedRef.current = false;
    };
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

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px] cursor-pointer">
          <SelectValue placeholder="Providers unavailable" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unavailable">Providers unavailable</SelectItem>
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

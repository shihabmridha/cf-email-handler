'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useProviderSettings } from '@/lib/hooks/useProviderSettings';
import { ProviderType } from '@/shared/enums/provider';
import { toast } from '@/components/ui/use-toast';

export default function ResendSettingsPage() {
  const { provider, loading, saveProvider } = useProviderSettings(
    ProviderType.RESEND,
  );
  const [apiKey, setApiKey] = useState('');
  const [domain, setDomain] = useState('');
  const [host, setHost] = useState('https://api.resend.com');

  useEffect(() => {
    if (provider) {
      setApiKey(provider.api?.token || '');
      setDomain(provider.domain || '');
      setHost(provider.api?.host || 'https://api.resend.com');
    }
  }, [provider]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProvider({
      domain,
      api: {
        token: apiKey,
        host,
      },
    });

    toast({
      title: 'Success',
      description: 'Resend settings saved successfully',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Resend Settings</h2>
      <div className="space-y-2">
        <Label htmlFor="resend-api">API Key</Label>
        <Input
          id="resend-api"
          type="password"
          placeholder="Enter Resend API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resend-domain">Domain</Label>
        <Input
          id="resend-domain"
          placeholder="Enter Domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resend-host">API Host</Label>
        <Input
          id="resend-host"
          placeholder="Enter API Host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Save Resend Settings</Button>
    </form>
  );
}

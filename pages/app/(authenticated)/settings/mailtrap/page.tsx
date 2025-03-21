'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProviderSettings } from '@/lib/hooks/useProviderSettings';
import { ProviderType } from '@/shared/enums/provider';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { toast } from '@/components/ui/use-toast';
import { ApiError } from '@/lib/api-client';

export default function MailtrapSettingsPage() {
  const { provider, loading, saveProvider } = useProviderSettings(
    ProviderType.MAILTRAP,
  );

  // SMTP settings
  const [host, setHost] = useState('');
  const [port, setPort] = useState('2525');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // API settings
  const [apiKey, setApiKey] = useState('');
  const [domain, setDomain] = useState('');
  const [apiHost, setApiHost] = useState('https://send.api.mailtrap.io');

  // Active tab
  const [activeTab, setActiveTab] = useState('smtp');

  useEffect(() => {
    if (!loading && provider) {
      // Set SMTP settings if available
      if (provider.smtp) {
        setHost(provider.smtp.host || '');
        setPort(provider.smtp.port?.toString() || '2525');
        setUsername(provider.smtp.username || '');
        setPassword(provider.smtp.password || '');
      }

      // Set API settings if available
      if (provider.api) {
        setApiKey(provider.api.token || '');
        setApiHost(provider.api.host || 'https://send.api.mailtrap.io');
      }

      setDomain(provider.domain || '');

      // Set active tab based on which configuration exists
      if (provider.api && !provider.smtp) {
        setActiveTab('api');
      } else if (provider.smtp && !provider.api) {
        setActiveTab('smtp');
      }
    }
  }, [provider, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config: Partial<ProviderConfigDto> = {
      // Preserve existing provider data
      ...provider,
      domain: activeTab === 'smtp' ? host : domain,
      // Update only the active configuration while preserving the other
      smtp:
        activeTab === 'smtp'
          ? {
              host,
              port: parseInt(port),
              secure: parseInt(port) === 465,
              username,
              password,
            }
          : provider?.smtp, // Keep existing SMTP config if in API mode
      api:
        activeTab === 'api'
          ? {
              token: apiKey,
              host: apiHost,
            }
          : provider?.api, // Keep existing API config if in SMTP mode
    };

    try {
      await saveProvider(config);
      toast({
        title: 'Success',
        description: 'Provider settings saved successfully',
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'Failed to save provider settings';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Mailtrap Settings</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mailtrap-host">SMTP Host</Label>
              <Input
                id="mailtrap-host"
                placeholder="Enter SMTP Host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                required={activeTab === 'smtp'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-port">SMTP Port</Label>
              <Input
                id="mailtrap-port"
                placeholder="Enter SMTP Port"
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required={activeTab === 'smtp'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-username">SMTP Username</Label>
              <Input
                id="mailtrap-username"
                placeholder="Enter SMTP Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={activeTab === 'smtp'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-password">SMTP Password</Label>
              <Input
                id="mailtrap-password"
                type="password"
                placeholder="Enter SMTP Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={activeTab === 'smtp'}
              />
            </div>
            <Button type="submit">Save SMTP Settings</Button>
          </form>
        </TabsContent>

        <TabsContent value="api">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mailtrap-api-key">API Key</Label>
              <Input
                id="mailtrap-api-key"
                type="password"
                placeholder="Enter Mailtrap API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required={activeTab === 'api'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-domain">Domain</Label>
              <Input
                id="mailtrap-domain"
                placeholder="Enter Domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required={activeTab === 'api'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-api-host">API Host</Label>
              <Input
                id="mailtrap-api-host"
                placeholder="Enter API Host"
                value={apiHost}
                onChange={(e) => setApiHost(e.target.value)}
                required={activeTab === 'api'}
              />
            </div>
            <Button type="submit">Save API Settings</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

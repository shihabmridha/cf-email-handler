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

  // Form state
  const [formState, setFormState] = useState({
    // SMTP settings
    host: '',
    port: '2525',
    username: '',
    password: '',
    // API settings
    apiKey: '',
    domain: '',
    apiHost: 'https://send.api.mailtrap.io',
    // Active tab
    activeTab: 'smtp',
  });

  // Destructure for convenience
  const { host, port, username, password, apiKey, domain, apiHost, activeTab } =
    formState;

  // Update form field
  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!loading && provider) {
      const newState = { ...formState };

      // Set SMTP settings if available
      if (provider.smtp) {
        newState.host = provider.smtp.host || '';
        newState.port = provider.smtp.port?.toString() || '2525';
        newState.username = provider.smtp.username || '';
        newState.password = provider.smtp.password || '';
      }

      // Set API settings if available
      if (provider.api) {
        newState.apiKey = provider.api.token || '';
        newState.apiHost = provider.api.host || 'https://send.api.mailtrap.io';
      }

      newState.domain = provider.domain || '';

      // Set active tab based on which configuration exists
      if (provider.api && !provider.smtp) {
        newState.activeTab = 'api';
      } else if (provider.smtp && !provider.api) {
        newState.activeTab = 'smtp';
      }

      setFormState(newState);
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
      // Update only the active configuration
      smtp:
        activeTab === 'smtp'
          ? {
              host,
              port: parseInt(port),
              secure: parseInt(port) === 465,
              username,
              password,
            }
          : provider?.smtp,
      api:
        activeTab === 'api'
          ? {
              token: apiKey,
              host: apiHost,
            }
          : provider?.api,
    };

    try {
      await saveProvider(config);
      toast({
        title: 'Success',
        description: 'Provider settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof ApiError
            ? error.message
            : 'Failed to save provider settings',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Mailtrap Settings</h2>

      <Tabs
        value={activeTab}
        onValueChange={(value) => updateField('activeTab', value)}
      >
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
                onChange={(e) => updateField('host', e.target.value)}
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
                onChange={(e) => updateField('port', e.target.value)}
                required={activeTab === 'smtp'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-username">SMTP Username</Label>
              <Input
                id="mailtrap-username"
                placeholder="Enter SMTP Username"
                value={username}
                onChange={(e) => updateField('username', e.target.value)}
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
                onChange={(e) => updateField('password', e.target.value)}
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
                onChange={(e) => updateField('apiKey', e.target.value)}
                required={activeTab === 'api'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-domain">Domain</Label>
              <Input
                id="mailtrap-domain"
                placeholder="Enter Domain"
                value={domain}
                onChange={(e) => updateField('domain', e.target.value)}
                required={activeTab === 'api'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mailtrap-api-host">API Host</Label>
              <Input
                id="mailtrap-api-host"
                placeholder="Enter API Host"
                value={apiHost}
                onChange={(e) => updateField('apiHost', e.target.value)}
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

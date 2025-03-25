'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { ApiError } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { ProviderType } from '@/shared/enums/provider';
import { Eye, EyeOff } from 'lucide-react';

interface ProviderSettingsFormProps {
  provider: ProviderConfigDto | null;
  loading: boolean;
  onSave: (config: Partial<ProviderConfigDto>) => Promise<void>;
  providerName: string;
  defaultApiHost?: string;
}

export function ProviderSettingsForm({
  provider,
  loading,
  onSave,
  providerName,
  defaultApiHost = 'https://api.resend.com',
}: ProviderSettingsFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: providerName || '',
    type: provider?.type,
    domain: provider?.domain || '',
    apiKey: '',
    apiHost: defaultApiHost,
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
  });

  const [showApiKey, setShowApiKey] = useState(false);

  // Update form when provider changes
  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name || '',
        type: provider.type,
        domain: provider.domain || '',
        apiKey: provider.api?.token || '',
        apiHost: provider.api?.host || defaultApiHost,
        smtpHost: provider.smtp?.host || '',
        smtpPort: provider.smtp?.port?.toString() || '',
        smtpUser: provider.smtp?.username || '',
        smtpPass: provider.smtp?.password || '',
      });
    }
  }, [provider, defaultApiHost]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    if (id === 'type') {
      const newType = parseInt(value) as ProviderType;
      const newApiHost = getDefaultApiHost(newType);

      setFormData((prev) => ({
        ...prev,
        type: newType,
        apiHost: newApiHost,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      name,
      type,
      domain,
      apiKey,
      apiHost,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
    } = formData;

    const config: Partial<ProviderConfigDto> = {
      name,
      type,
      domain,
      api: {
        token: apiKey,
        host: apiHost,
      },
      smtp: smtpHost
        ? {
            host: smtpHost,
            port: smtpPort ? parseInt(smtpPort, 10) : 587,
            username: smtpUser,
            password: smtpPass,
            secure: smtpPort === '465',
          }
        : undefined,
    };

    try {
      await onSave(config);
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

  // Get the default API host based on provider type
  const getDefaultApiHost = (providerType: ProviderType) => {
    switch (providerType) {
      case ProviderType.RESEND:
        return 'https://api.resend.com/emails';
      case ProviderType.MAILTRAP:
        return 'https://send.api.mailtrap.io';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{providerName} Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Provider Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter provider name"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="type">Provider Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
            >
              <option value={ProviderType.MAILTRAP}>Mailtrap</option>
              <option value={ProviderType.RESEND}>Resend</option>
            </select>
          </div>
          <div>
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="Enter domain"
              disabled={loading}
            />
          </div>
        </div>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api">API Configuration</TabsTrigger>
            <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
          </TabsList>
          <TabsContent value="api" className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter API key"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={loading}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showApiKey ? 'Hide API key' : 'Show API key'}
                  </span>
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="apiHost">Send Endpoint</Label>
              <Input
                id="apiHost"
                value={formData.apiHost}
                onChange={handleChange}
                placeholder="Enter send endpoint"
                disabled={loading}
              />
            </div>
          </TabsContent>
          <TabsContent value="smtp" className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={formData.smtpHost}
                onChange={handleChange}
                placeholder="Enter SMTP host"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={formData.smtpPort}
                onChange={handleChange}
                type="number"
                placeholder="Enter SMTP port"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={formData.smtpUser}
                onChange={handleChange}
                placeholder="Enter SMTP username"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="smtpPass">SMTP Password</Label>
              <Input
                id="smtpPass"
                value={formData.smtpPass}
                onChange={handleChange}
                type="password"
                placeholder="Enter SMTP password"
                disabled={loading}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={loading}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}

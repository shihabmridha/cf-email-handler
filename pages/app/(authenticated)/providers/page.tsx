'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProviderSettingsForm } from '@/components/provider-settings-form';
import { ProviderType } from '@/shared/enums/provider';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { useProviders } from '@/lib/hooks/useProviders';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';

export default function ProvidersPage() {
  const { providers, loading, error, refresh } = useProviders();
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderConfigDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const handleCreate = () => {
    setIsCreateMode(true);
    setSelectedProvider(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (provider: ProviderConfigDto) => {
    setIsCreateMode(false);
    setSelectedProvider(provider);
    setIsDialogOpen(true);
  };

  const handleDelete = async (provider: ProviderConfigDto) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      try {
        await apiClient.deleteProvider(provider.id);
        await refresh();
        toast({
          title: 'Success',
          description: 'Provider deleted successfully',
        });
      } catch (err) {
        console.error('Failed to delete provider:', err);
        toast({
          title: 'Error',
          description: 'Failed to delete provider',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSave = async (config: Partial<ProviderConfigDto>) => {
    try {
      if (isCreateMode) {
        await apiClient.createProvider({
          name:
            config.name ||
            `${ProviderType[config.type || ProviderType.UNKNOWN]} Provider`,
          type: config.type || ProviderType.UNKNOWN,
          domain: config.domain || '',
          userId: 0, // Will be set by backend
          enabled: true,
          ...config,
        });
        toast({
          title: 'Success',
          description: 'Provider created successfully',
        });
      } else if (selectedProvider) {
        await apiClient.updateProvider(selectedProvider.id, {
          ...config,
          name: config.name || selectedProvider.name,
        });
        toast({
          title: 'Success',
          description: 'Provider updated successfully',
        });
      }
      await refresh();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to save provider:', err);
      toast({
        title: 'Error',
        description: 'Failed to save provider',
        variant: 'destructive',
      });
    }
  };

  const getProviderConfig = (type: ProviderType) => {
    switch (type) {
      case ProviderType.MAILTRAP:
        return {
          name: 'Mailtrap',
          defaultApiHost: 'https://send.api.mailtrap.io',
        };
      case ProviderType.RESEND:
        return {
          name: 'Resend',
          defaultApiHost: 'https://api.resend.com',
        };
      default:
        return {
          name: 'Unknown',
          defaultApiHost: '',
        };
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Email Providers</h1>
        <Button onClick={handleCreate} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          Create Provider
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => {
              const config = getProviderConfig(provider.type);
              return (
                <tr key={provider.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {provider.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{config.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {provider.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {provider.enabled ? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(provider)}
                      disabled={loading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(provider)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? 'Create New Provider' : 'Edit Provider'}
            </DialogTitle>
          </DialogHeader>
          <ProviderSettingsForm
            provider={selectedProvider}
            loading={loading}
            onSave={handleSave}
            providerName={selectedProvider?.name || ''}
            defaultApiHost={
              selectedProvider
                ? getProviderConfig(selectedProvider.type).defaultApiHost
                : ''
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

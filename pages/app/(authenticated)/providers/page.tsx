'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProviderSettingsForm } from '@/components/provider-settings-form';
import { ProviderType } from '@/shared/enums/provider-type';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { useProviders } from '@/lib/hooks/useProviders';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';

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
          userId: 0,
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
    <div className="py-6 space-y-6">
      <PageHeader
        title="Email Providers"
        description="Configure and manage email providers"
        actions={
          <Button
            variant="default"
            onClick={handleCreate}
            disabled={loading}
            className="cursor-pointer"
          >
            Create Provider
          </Button>
        }
      />

      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/30 backdrop-blur-md z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => {
                const config = getProviderConfig(provider.type);
                return (
                  <TableRow key={provider.id}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{provider.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted rounded-full">
                        {config.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{provider.domain}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${provider.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {provider.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(provider)}
                          disabled={loading}
                          className="cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(provider)}
                          disabled={loading}
                          className="cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {providers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-foreground">No email providers found</h3>
                        <p className="text-xs text-muted-foreground mt-1">Create your first provider to start sending emails</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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

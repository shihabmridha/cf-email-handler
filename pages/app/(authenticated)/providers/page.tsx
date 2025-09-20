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
import { Pencil, Trash2, Shield } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';
import { TableEmptyState } from '@/components/table-empty-state';

export default function ProvidersPage() {
  const { providers, loading, error, refresh } = useProviders();
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderConfigDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { toast } = useToast();

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
        const message =
          err instanceof Error ? err.message : 'Failed to delete provider';
        toast({
          title: 'Error',
          description: message,
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
      const message =
        err instanceof Error ? err.message : 'Failed to save provider';
      toast({
        title: 'Error',
        description: message,
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

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refresh().catch(() => {
                  /* handled via hook */
                });
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

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
                <TableEmptyState
                  colSpan={5}
                  icon={<Shield className="h-5 w-5 text-muted-foreground" />}
                  title="No email providers found"
                  description="Create your first provider to start sending emails"
                />
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

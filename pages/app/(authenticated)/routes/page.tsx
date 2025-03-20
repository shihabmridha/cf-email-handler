'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';
import { EmailRouteDto } from '@/shared/dtos/email-route';
import { EmailType } from '@/shared/enums/email-type';

interface EditableEmailRouteDto extends EmailRouteDto {
  isEditing: boolean;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<EditableEmailRouteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newRoute, setNewRoute] = useState<EmailRouteDto>(new EmailRouteDto());
  const { toast } = useToast();

  const loadRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getEmailRoutes();
      setRoutes(
        response.routes.map((route) => ({
          ...route,
          isEditing: false,
        })),
      );
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load routes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const handleAddRoute = async () => {
    try {
      setLoading(true);
      const { email, destination, type, enabled } = newRoute;
      await apiClient.createEmailRoute({
        email,
        destination,
        type,
        enabled,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setNewRoute(new EmailRouteDto());
      setShowAddPanel(false);
      await loadRoutes();
      toast({
        title: 'Success',
        description: 'Route added successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add route',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async (route: EditableEmailRouteDto) => {
    try {
      setLoading(true);
      const { id, email, destination, type, enabled } = route;
      await apiClient.updateEmailRoute(id, {
        email,
        destination,
        type,
        enabled,
        userId: route.userId,
        createdAt: route.createdAt,
        updatedAt: new Date(),
      });
      await loadRoutes();
      toast({
        title: 'Success',
        description: 'Route updated successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update route',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (id: number) => {
    try {
      setLoading(true);
      await apiClient.deleteEmailRoute(id);
      await loadRoutes();
      toast({
        title: 'Success',
        description: 'Route deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete route',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoute = (route: EditableEmailRouteDto) => {
    setRoutes(
      routes.map((r) => ({
        ...r,
        isEditing: r.id === route.id ? true : r.isEditing,
      })),
    );
  };

  const handleUpdateRoute = (
    route: EditableEmailRouteDto,
    updates: Partial<EmailRouteDto>,
  ) => {
    setRoutes(
      routes.map((r) => (r.id === route.id ? { ...r, ...updates } : r)),
    );
  };

  const handleCancelEdit = (route: EditableEmailRouteDto) => {
    setRoutes(
      routes.map((r) => ({
        ...r,
        isEditing: r.id === route.id ? false : r.isEditing,
      })),
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Email Routes</h1>
        <Button onClick={() => setShowAddPanel(true)} disabled={loading}>
          Add Route
        </Button>
      </div>

      {showAddPanel && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Route</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddPanel(false)}
            >
              ✕
            </Button>
          </div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newRoute.email}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, email: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="new-destination">Destination</Label>
              <Input
                id="new-destination"
                type="text"
                value={newRoute.destination}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, destination: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="new-type">Type</Label>
              <Select
                value={newRoute.type}
                onValueChange={(value: EmailType) =>
                  setNewRoute({ ...newRoute, type: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmailType.UNKNOWN}>Unknown</SelectItem>
                  <SelectItem value={EmailType.OTP}>OTP</SelectItem>
                  <SelectItem value={EmailType.INVOICE}>Invoice</SelectItem>
                  <SelectItem value={EmailType.PROMOTIONAL}>
                    Promotional
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="new-enabled"
                checked={newRoute.enabled}
                onCheckedChange={(checked: boolean) =>
                  setNewRoute({ ...newRoute, enabled: checked })
                }
                disabled={loading}
              />
              <Label htmlFor="new-enabled">Enabled</Label>
            </div>
            <Button onClick={handleAddRoute} disabled={loading}>
              Add Route
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enabled
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {route.isEditing ? (
                    <Input
                      type="email"
                      value={route.email}
                      onChange={(e) =>
                        handleUpdateRoute(route, { email: e.target.value })
                      }
                      disabled={loading}
                    />
                  ) : (
                    route.email
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {route.isEditing ? (
                    <Input
                      type="text"
                      value={route.destination}
                      onChange={(e) =>
                        handleUpdateRoute(route, {
                          destination: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                  ) : (
                    route.destination
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {route.isEditing ? (
                    <Select
                      value={route.type}
                      onValueChange={(value: EmailType) =>
                        handleUpdateRoute(route, { type: value })
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EmailType.UNKNOWN}>
                          Unknown
                        </SelectItem>
                        <SelectItem value={EmailType.OTP}>OTP</SelectItem>
                        <SelectItem value={EmailType.INVOICE}>
                          Invoice
                        </SelectItem>
                        <SelectItem value={EmailType.PROMOTIONAL}>
                          Promotional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    route.type
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Switch
                    checked={route.enabled}
                    onCheckedChange={(checked: boolean) => {
                      if (route.isEditing) {
                        handleUpdateRoute(route, { enabled: checked });
                      } else {
                        handleSaveRoute({ ...route, enabled: checked });
                      }
                    }}
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {route.isEditing ? (
                    <>
                      <Button
                        onClick={() => handleSaveRoute(route)}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCancelEdit(route)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleEditRoute(route)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteRoute(route.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

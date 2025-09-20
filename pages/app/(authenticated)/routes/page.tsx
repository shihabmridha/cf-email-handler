'use client';

import { useState } from 'react';
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
import { EmailRouteDto } from '@/shared/dtos/email-route';
import { EmailClass } from '@/shared/enums/email-class';
import { useEmailRoutes } from '@/lib/hooks/useEmailRoutes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/page-header';
import { TableEmptyState } from '@/components/table-empty-state';
import { Mail } from 'lucide-react';

export default function RoutesPage() {
  const {
    routes,
    loading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    setRouteEditing,
    updateRouteLocal,
  } = useEmailRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const [newRoute, setNewRoute] = useState<EmailRouteDto>(new EmailRouteDto());
  const { toast } = useToast();

  const handleAddRoute = async () => {
    try {
      const { email, destination, type, enabled } = newRoute;
      await createRoute({
        email,
        destination,
        type,
        enabled,
      });
      setNewRoute(new EmailRouteDto());
      setIsOpen(false);
      toast({
        title: 'Success',
        description: 'Route added successfully',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to add route';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleSaveRoute = async (
    route: EmailRouteDto,
    updates?: Partial<EmailRouteDto>,
    shouldRefresh: boolean = true,
  ) => {
    try {
      await updateRoute(route.id, updates ?? route, shouldRefresh);
      toast({
        title: 'Success',
        description: 'Route updated successfully',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update route';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRoute = async (id: number) => {
    try {
      await deleteRoute(id);
      toast({
        title: 'Success',
        description: 'Route deleted successfully',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete route';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="py-6 space-y-6">
      <PageHeader
        title="Email Routes"
        description="Create and manage email routing rules"
        actions={
          <Button
            variant="default"
            onClick={() => setIsOpen(true)}
            disabled={loading}
            className="cursor-pointer"
          >
            Add Route
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                onValueChange={(value: EmailClass) =>
                  setNewRoute({ ...newRoute, type: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmailClass.UNKNOWN}>Unknown</SelectItem>
                  <SelectItem value={EmailClass.OTP}>OTP</SelectItem>
                  <SelectItem value={EmailClass.INVOICE}>Invoice</SelectItem>
                  <SelectItem value={EmailClass.TRANSACTIONAL}>Transactional</SelectItem>
                  <SelectItem value={EmailClass.PROMOTIONAL}>
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
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddRoute}
                disabled={loading}
                className="cursor-pointer"
              >
                Add Route
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/30 backdrop-blur-md z-10">
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead>Drop</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-semibold text-foreground">
                    {route.isEditing ? (
                      <Input
                        type="email"
                        value={route.email}
                        onChange={(e) =>
                          updateRouteLocal(route.id, { email: e.target.value })
                        }
                        disabled={loading}
                        className="h-8"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{route.email}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {route.isEditing ? (
                      <Input
                        type="text"
                        value={route.destination}
                        onChange={(e) =>
                          updateRouteLocal(route.id, {
                            destination: e.target.value,
                          })
                        }
                        disabled={loading}
                        className="h-8"
                      />
                    ) : (
                      route.destination
                    )}
                  </TableCell>
                  <TableCell>
                    {route.isEditing ? (
                      <Select
                        value={route.type}
                        onValueChange={(value: EmailClass) =>
                          updateRouteLocal(route.id, { type: value })
                        }
                        disabled={loading}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EmailClass.UNKNOWN}>
                            Unknown
                          </SelectItem>
                          <SelectItem value={EmailClass.OTP}>OTP</SelectItem>
                          <SelectItem value={EmailClass.INVOICE}>
                            Invoice
                          </SelectItem>
                          <SelectItem value={EmailClass.PROMOTIONAL}>
                            Promotional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted rounded-full">
                        {route.type}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={route.enabled}
                      onCheckedChange={async (checked: boolean) => {
                        if (route.isEditing) {
                          updateRouteLocal(route.id, { enabled: checked });
                        } else {
                          await handleSaveRoute(
                            route,
                            { enabled: checked },
                            false,
                          );
                        }
                      }}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={route.drop}
                      onCheckedChange={async (checked: boolean) => {
                        if (route.isEditing) {
                          updateRouteLocal(route.id, { drop: checked });
                        } else {
                          await handleSaveRoute(route, { drop: checked }, false);
                        }
                      }}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="text-xs">{route.received}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="text-xs">{route.sent}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {route.isEditing ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSaveRoute(route)}
                            disabled={loading}
                            className="cursor-pointer"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRouteEditing(route.id, false)}
                            disabled={loading}
                            className="cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRouteEditing(route.id, true)}
                            disabled={loading}
                            className="cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRoute(route.id)}
                            disabled={loading}
                            className="cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {routes.length === 0 && (
                <TableEmptyState
                  colSpan={8}
                  icon={<Mail className="h-5 w-5 text-muted-foreground" />}
                  title="No email routes found"
                  description="Add your first route to start managing email forwarding"
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

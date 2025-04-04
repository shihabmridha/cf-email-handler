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

export default function RoutesPage() {
  const {
    routes,
    loading,
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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add route',
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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update route',
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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete route',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Email Routes</h1>
        <Button
          variant="default"
          onClick={() => setIsOpen(true)}
          disabled={loading}
          className="cursor-pointer"
        >
          Add Route
        </Button>
      </div>

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

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
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
                <TableCell>
                  {route.isEditing ? (
                    <Input
                      type="email"
                      value={route.email}
                      onChange={(e) =>
                        updateRouteLocal(route.id, { email: e.target.value })
                      }
                      disabled={loading}
                    />
                  ) : (
                    route.email
                  )}
                </TableCell>
                <TableCell>
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
                      <SelectTrigger>
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
                    route.type
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
                <TableCell>{route.received}</TableCell>
                <TableCell>{route.sent}</TableCell>
                <TableCell className="space-x-2">
                  {route.isEditing ? (
                    <>
                      <Button
                        variant="default"
                        onClick={() => handleSaveRoute(route)}
                        disabled={loading}
                        className="cursor-pointer"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
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
                        onClick={() => setRouteEditing(route.id, true)}
                        disabled={loading}
                        className="cursor-pointer"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteRoute(route.id)}
                        disabled={loading}
                        className="cursor-pointer"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

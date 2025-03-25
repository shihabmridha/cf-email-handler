import { EmailRouteDto } from "@/shared/dtos/email-route";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from '@/lib/api-client';

interface EditableEmailRouteDto extends EmailRouteDto {
  isEditing: boolean;
}

export function useEmailRoutes() {
  const [routes, setRoutes] = useState<EditableEmailRouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);

  const loadRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getEmailRoutes();
      setRoutes(response.routes.map(route => ({
        ...route,
        isEditing: false
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadRoutes();
      initialLoadDone.current = true;
    }
  }, [loadRoutes]);

  const createRoute = async (data: Pick<EmailRouteDto, 'email' | 'destination' | 'type' | 'enabled'>) => {
    setLoading(true);
    try {
      await apiClient.createEmailRoute({
        ...data,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await loadRoutes();
    } finally {
      setLoading(false);
    }
  };

  const updateRoute = async (id: number, data: Partial<EmailRouteDto>, shouldRefresh = true) => {
    setLoading(true);
    try {
      const route = routes.find(r => r.id === id);
      if (!route) throw new Error('Route not found');

      await apiClient.updateEmailRoute(id, {
        ...route,
        ...data,
        updatedAt: new Date(),
      });

      if (shouldRefresh) {
        await loadRoutes();
      } else {
        setRoutes(routes.map(r => r.id === id ? { ...r, ...data } : r));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (id: number) => {
    setLoading(true);
    try {
      await apiClient.deleteEmailRoute(id);
      await loadRoutes();
    } finally {
      setLoading(false);
    }
  };

  const setRouteEditing = (id: number, isEditing: boolean) => {
    setRoutes(routes.map(r => ({
      ...r,
      isEditing: r.id === id ? isEditing : r.isEditing
    })));
  };

  const updateRouteLocal = (id: number, updates: Partial<EmailRouteDto>) => {
    setRoutes(routes.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  return {
    routes,
    loading,
    createRoute,
    updateRoute,
    deleteRoute,
    setRouteEditing,
    updateRouteLocal,
    refresh: loadRoutes
  };
}

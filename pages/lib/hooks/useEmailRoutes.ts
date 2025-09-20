import { useCallback, useEffect, useRef, useState } from 'react';
import { EmailRouteDto } from '@/shared/dtos/email-route';
import { apiClient, ApiError } from '@/lib/api-client';

interface EditableEmailRouteDto extends EmailRouteDto {
  isEditing: boolean;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export function useEmailRoutes() {
  const [routes, setRoutes] = useState<EditableEmailRouteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getEmailRoutes();
      setRoutes(
        response.routes.map((route) => ({
          ...route,
          isEditing: false,
        })),
      );
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      loadRoutes().catch(() => {
        // error state handled above
      });
      hasFetched.current = true;
    }
  }, [loadRoutes]);

  const createRoute = useCallback(
    async (
      data: Pick<EmailRouteDto, 'email' | 'destination' | 'type' | 'enabled'>,
    ) => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.createEmailRoute({
          ...data,
          userId: 0,
          drop: false,
        });
        await loadRoutes();
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadRoutes],
  );

  const updateRoute = useCallback(
    async (id: number, data: Partial<EmailRouteDto>, shouldRefresh = true) => {
      setLoading(true);
      setError(null);

      try {
        const current = routes.find((route) => route.id === id);
        if (!current) {
          throw new Error('Route not found');
        }

        await apiClient.updateEmailRoute(id, {
          ...current,
          ...data,
        });

        if (shouldRefresh) {
          await loadRoutes();
        } else {
          setRoutes((prev) =>
            prev.map((route) =>
              route.id === id
                ? {
                    ...route,
                    ...data,
                  }
                : route,
            ),
          );
        }
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadRoutes, routes],
  );

  const deleteRoute = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.deleteEmailRoute(id);
        setRoutes((prev) => prev.filter((route) => route.id !== id));
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const setRouteEditing = useCallback((id: number, isEditing: boolean) => {
    setRoutes((prev) =>
      prev.map((route) => ({
        ...route,
        isEditing: route.id === id ? isEditing : route.isEditing,
      })),
    );
  }, []);

  const updateRouteLocal = useCallback(
    (id: number, updates: Partial<EmailRouteDto>) => {
      setRoutes((prev) =>
        prev.map((route) => (route.id === id ? { ...route, ...updates } : route)),
      );
    },
    [],
  );

  return {
    routes,
    loading,
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    setRouteEditing,
    updateRouteLocal,
    refresh: loadRoutes,
  };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { DraftDto } from '@/shared/dtos/draft';
import { apiClient, ApiError } from '../api-client';

type DraftDataForApi = Omit<DraftDto, 'id' | 'createdAt' | 'updatedAt'>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export function useDrafts() {
  const [drafts, setDrafts] = useState<DraftDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getDrafts();
      setDrafts(data.drafts);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDraft = useCallback(
    async (draft: DraftDto) => {
      setLoading(true);
      setError(null);

      try {
        const { id, ...draftPayload } = draft;

        if (id) {
          await apiClient.updateDraft(id, draftPayload as DraftDataForApi);
        } else {
          await apiClient.createDraft(draftPayload as DraftDataForApi);
        }

        await fetchDrafts();
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDrafts],
  );

  const deleteDraft = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.deleteDraft(id);
      setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDrafts().catch(() => {
        // error state is already set inside fetchDrafts
      });
      hasFetched.current = true;
    }
  }, [fetchDrafts]);

  return { drafts, loading, error, saveDraft, deleteDraft, fetchDrafts };
}

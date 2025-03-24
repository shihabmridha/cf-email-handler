import { DraftDto } from "@/shared/dtos/draft";
import { useEffect, useState, useRef, useCallback } from "react";
import { apiClient } from "../api-client";

type DraftDataForApi = Omit<DraftDto, 'id' | 'createdAt' | 'updatedAt'>;

export function useDrafts() {
  const [drafts, setDrafts] = useState<DraftDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const fetchDrafts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getDrafts();
      setDrafts(data.drafts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDraft = async (draft: DraftDto) => {
    try {
      setLoading(true);
      setError(null);

      const { id, ...draftData } = draft;

      if (id) {
        await apiClient.updateDraft(id, draftData as DraftDataForApi);

        setDrafts(drafts.map(d => d.id === id ? { ...d, ...draftData } : d));
      } else {
        await apiClient.createDraft(draftData as DraftDataForApi);

        const tempDraft = {
          ...draftData,
          id: -1,
        };
        setDrafts([...drafts, tempDraft]);
      }

      await fetchDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteDraft(id);
      setDrafts(drafts.filter(draft => draft.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoadDone.current) {
      fetchDrafts();
      initialLoadDone.current = true;
    }
  }, [fetchDrafts]);

  return { drafts, loading, error, saveDraft, deleteDraft, fetchDrafts };
}

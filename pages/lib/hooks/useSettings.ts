import { useCallback, useEffect, useState } from 'react';
import { SettingKeys } from '@/shared/enums/settings-key';
import { SettingsDto } from '@/shared/dtos/settings';
import { apiClient, ApiError } from '@/lib/api-client';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export function useSettings() {
  const [forwardTo, setForwardTo] = useState('');
  const [signature, setSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [forwardToSetting, signatureSetting] = await Promise.allSettled([
        apiClient.getSetting(SettingKeys.EMAIL_FORWARD_TO),
        apiClient.getSetting(SettingKeys.EMAIL_SIGNATURE),
      ]);

      if (forwardToSetting.status === 'fulfilled') {
        setForwardTo(forwardToSetting.value?.value || '');
      }

      if (signatureSetting.status === 'fulfilled') {
        setSignature(signatureSetting.value?.value || '');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load settings'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings().catch(() => {
      // loadSettings already sets the error state
    });
  }, [loadSettings]);

  const updateSetting = useCallback(async (data: SettingsDto) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.updateSetting(data);

      if (data.key === SettingKeys.EMAIL_FORWARD_TO) {
        setForwardTo(data.value);
      }

      if (data.key === SettingKeys.EMAIL_SIGNATURE) {
        setSignature(data.value);
      }
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to update setting');
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    forwardTo,
    setForwardTo,
    signature,
    setSignature,
    updateSetting,
    isLoading,
    error,
    reload: loadSettings,
  };
}

import { useState, useEffect } from 'react';
import { SettingKeys } from '@/shared/enums/settings-key';
import { SettingsDto } from '@/shared/dtos/settings.dto';
import { apiClient } from '@/lib/api-client';

export function useSettings() {
  const [forwardTo, setForwardTo] = useState('');
  const [signature, setSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [forwardToSetting, signatureSetting] = await Promise.allSettled([
          apiClient.getSetting(SettingKeys.EMAIL_FORWARD_TO),
          apiClient.getSetting(SettingKeys.EMAIL_SIGNATURE)
        ]);

        if (forwardToSetting.status === 'fulfilled') {
          setForwardTo(forwardToSetting.value?.value || '');
        }

        if (signatureSetting.status === 'fulfilled') {
          setSignature(signatureSetting.value?.value || '');
        }
      } catch (err) {
        setError('Failed to load settings');
        console.error('Error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSetting = async (data: SettingsDto) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiClient.updateSetting(data);

      // Update local state based on the setting key
      if (data.key === SettingKeys.EMAIL_FORWARD_TO) {
        setForwardTo(data.value);
      } else if (data.key === SettingKeys.EMAIL_SIGNATURE) {
        setSignature(data.value);
      }
    } catch (err) {
      setError('Failed to update setting');
      console.error('Error updating setting:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    forwardTo,
    setForwardTo,
    signature,
    setSignature,
    updateSetting,
    isLoading,
    error
  };
}

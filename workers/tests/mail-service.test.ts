import { describe, expect, test, mock } from 'bun:test';
import { MailService } from '../src/services/mail';
import { ProviderConfigService } from '../src/services/provider/config';
import { SendMailDto } from '@/dtos/mail';
import { ProviderType } from '@/enums/provider-type';
import { TransportContent } from '@/dtos/transport';

describe('MailService', () => {
  test('should prefer API transport when both API and SMTP are configured', async () => {
    const sendByApi = mock(() => Promise.resolve(true));
    const sendBySmtp = mock(() => Promise.resolve(true));

    const mockProvider = {
      sendByApi,
      sendBySmtp,
    };

    const mockProviderConfigService = {
      getById: mock(() => Promise.resolve({
        id: 1,
        type: ProviderType.RESEND,
        smtp: { host: 'smtp.example.com', port: 587, secure: false, username: 'u', password: 'p' },
        api: { token: 'token', host: 'https://api.example.com' },
      })),
    } as unknown as ProviderConfigService;

    const originalGetProvider = (await import('../src/services/provider/factory')).ProviderFactory.getProvider;
    (await import('../src/services/provider/factory')).ProviderFactory.getProvider = mock(() => mockProvider) as unknown as typeof originalGetProvider;

    try {
      const service = new MailService(mockProviderConfigService);
      const payload = new SendMailDto();
      payload.providerConfigId = 1;
      payload.content = new TransportContent();

      const sent = await service.send(payload);

      expect(sent).toBe(true);
      expect(sendByApi).toHaveBeenCalledTimes(1);
      expect(sendBySmtp).not.toHaveBeenCalled();
    } finally {
      (await import('../src/services/provider/factory')).ProviderFactory.getProvider = originalGetProvider;
    }
  });

  test('should use SMTP when only SMTP is configured', async () => {
    const sendByApi = mock(() => Promise.resolve(true));
    const sendBySmtp = mock(() => Promise.resolve(true));

    const mockProvider = {
      sendByApi,
      sendBySmtp,
    };

    const mockProviderConfigService = {
      getById: mock(() => Promise.resolve({
        id: 1,
        type: ProviderType.MAILTRAP,
        smtp: { host: 'smtp.example.com', port: 587, secure: false, username: 'u', password: 'p' },
        api: null,
      })),
    } as unknown as ProviderConfigService;

    const originalGetProvider = (await import('../src/services/provider/factory')).ProviderFactory.getProvider;
    (await import('../src/services/provider/factory')).ProviderFactory.getProvider = mock(() => mockProvider) as unknown as typeof originalGetProvider;

    try {
      const service = new MailService(mockProviderConfigService);
      const payload = new SendMailDto();
      payload.providerConfigId = 1;
      payload.content = new TransportContent();

      const sent = await service.send(payload);

      expect(sent).toBe(true);
      expect(sendBySmtp).toHaveBeenCalledTimes(1);
      expect(sendByApi).not.toHaveBeenCalled();
    } finally {
      (await import('../src/services/provider/factory')).ProviderFactory.getProvider = originalGetProvider;
    }
  });
});

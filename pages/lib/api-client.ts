import { LoginDto, LoginResponse } from '@/shared/dtos/auth';
import { DraftDto } from '@/shared/dtos/draft';
import { EmailRouteDto } from '@/shared/dtos/email-route';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { SendMailDto } from '@/shared/dtos/mail';
import { ProviderType } from '@/shared/enums/provider';
import { IncomingHistoryDto } from '@/shared/dtos/incoming-history.dto';
import { SettingsDto } from '@/shared/dtos/settings.dto';
import { SettingKeys } from '@/shared/enums/settings-key';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl = API_BASE_URL;
  private authToken: string | null = null;

  constructor() {
    // Initialize authToken from localStorage if available
    if (this.isLocalStorageAvailable()) {
      this.authToken = localStorage.getItem('auth_token');
    }
  }

  private isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new ApiError(response.status, error.error || 'An error occurred');
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType?.includes('application/json')) {
      return null as T;
    }

    try {
      return await response.json();
    } catch {
      return null as T;
    }
  }

  // Auth
  async login(data: LoginDto): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  setAuthToken(token: string) {
    this.authToken = token;
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('auth_token', token);
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  removeAuthToken() {
    this.authToken = null;
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('auth_token');
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authToken) {
      return false;
    }
    return this.verifyToken();
  }

  async getSetting(key: SettingKeys): Promise<SettingsDto | null> {
    return this.request<SettingsDto>(`/settings/${key}`);
  }

  async updateSetting(data: SettingsDto): Promise<void> {
    return this.request<void>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Email Route API calls
  async getEmailRoutes(): Promise<{ routes: EmailRouteDto[] }> {
    return this.request<{ routes: EmailRouteDto[] }>('/email-route');
  }

  async createEmailRoute(data: Omit<EmailRouteDto, 'id' | 'received' | 'sent' | 'createdAt' | 'updatedAt'>): Promise<void> {
    return this.request<void>('/email-route', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmailRoute(id: number, data: Omit<EmailRouteDto, 'id' | 'received' | 'sent' | 'createdAt' | 'updatedAt'>): Promise<void> {
    return this.request<void>(`/email-route/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmailRoute(id: number): Promise<void> {
    return this.request<void>(`/email-route/${id}`, {
      method: 'DELETE',
    });
  }

  // Provider API calls
  async getProviders(): Promise<ProviderConfigDto[]> {
    const response = await this.request<{ providers: ProviderConfigDto[] }>('/provider-configs');
    return response.providers;
  }

  async getProviderByType(type: ProviderType): Promise<ProviderConfigDto | null> {
    const response = await this.request<{ provider: ProviderConfigDto | null }>(`/provider-configs/type/${type}`);
    return response.provider;
  }

  async createProvider(data: Omit<ProviderConfigDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    return this.request<void>('/provider-configs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProvider(id: number, data: Partial<ProviderConfigDto>): Promise<void> {
    return this.request<void>(`/provider-configs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProvider(id: number): Promise<void> {
    return this.request<void>(`/provider-configs/${id}`, {
      method: 'DELETE',
    });
  }

  async testProvider(id: number): Promise<void> {
    return this.request<void>(`/provider-configs/${id}/test`, {
      method: 'POST',
    });
  }

  // Draft API calls
  async getDrafts(): Promise<{ drafts: DraftDto[] }> {
    return this.request<{ drafts: DraftDto[] }>('/drafts');
  }

  async createDraft(data: Omit<DraftDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    return this.request<void>('/drafts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDraft(id: number, data: Omit<DraftDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    return this.request<void>(`/drafts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDraft(id: number): Promise<void> {
    return this.request<void>(`/drafts/${id}`, {
      method: 'DELETE',
    });
  }

  // Mail API calls
  async sendEmail(data: SendMailDto): Promise<void> {
    return this.request<void>('/email/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // History API calls
  async getIncomingHistory(): Promise<{ histories: IncomingHistoryDto[] }> {
    return this.request<{ histories: IncomingHistoryDto[] }>('/incoming-history');
  }
}

export const apiClient = new ApiClient();

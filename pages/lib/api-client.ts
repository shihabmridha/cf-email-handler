import { LoginDto } from '@/shared/dtos/auth';
import { DraftDto } from '@/shared/dtos/draft';
import { EmailRouteDto } from '@/shared/dtos/email-route';
import { ProviderConfigDto } from '@/shared/dtos/provider';
import { SendMailDto } from '@/shared/dtos/mail';
import { ProviderType } from '@/shared/enums/provider';
import { IncomingHistoryDto } from '@/shared/dtos/incoming-history.dto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new ApiError(response.status, error.error || 'An error occurred');
  }

  const contentType = response.headers.get('Content-Type');
  if (!contentType?.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export interface LoginResponse {
  token: string;
}

export interface ForwardToEmailResponse {
  email: string;
}

function isLocalStorageAvailable(): boolean {
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

export const apiClient = {
  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  setAuthToken(token: string) {
    if (isLocalStorageAvailable()) {
      localStorage.setItem('auth_token', token);
    }
  },

  getAuthToken(): string | null {
    if (!isLocalStorageAvailable()) {
      return null;
    }
    return localStorage.getItem('auth_token');
  },

  removeAuthToken() {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem('auth_token');
    }
  },

  async verifyToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }
    return this.verifyToken();
  },

  // Email Route API calls
  async getEmailRoutes(): Promise<{ routes: EmailRouteDto[] }> {
    const response = await fetch(`${API_BASE_URL}/email-route`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  async createEmailRoute(data: Omit<EmailRouteDto, 'id' | 'received' | 'sent' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email-route`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateEmailRoute(id: number, data: Omit<EmailRouteDto, 'id' | 'received' | 'sent' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email-route/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteEmailRoute(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email-route/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  async getForwardToEmail(): Promise<ForwardToEmailResponse> {
    const response = await fetch(`${API_BASE_URL}/config/forward-to`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Provider API calls
  async getProviders(): Promise<ProviderConfigDto[]> {
    const response = await fetch(`${API_BASE_URL}/provider-configs`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    const data = await handleResponse(response);
    return data.providers;
  },

  async getProviderByType(type: ProviderType): Promise<ProviderConfigDto | null> {
    const response = await fetch(`${API_BASE_URL}/provider-configs/type/${type}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    const data = await handleResponse(response);
    if (!data || !data.provider) {
      return null;
    }
    return data.provider;
  },

  async createProvider(data: Omit<ProviderConfigDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/provider-configs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateProvider(id: number, data: Partial<ProviderConfigDto>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/provider-configs/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteProvider(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/provider-configs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  async testProvider(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/provider-configs/${id}/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Draft API calls
  async getDrafts(): Promise<{ drafts: DraftDto[] }> {
    const response = await fetch(`${API_BASE_URL}/drafts`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  async createDraft(data: Omit<DraftDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/drafts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateDraft(id: number, data: Omit<DraftDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/drafts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteDraft(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/drafts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  async sendEmail(data: SendMailDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  },

  async getIncomingHistory(): Promise<{ histories: IncomingHistoryDto[] }> {
    const response = await fetch(`${API_BASE_URL}/incoming-history`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
};

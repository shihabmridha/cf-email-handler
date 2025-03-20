import { LoginDto } from '@/shared/dtos/auth';
import { EmailRouteDto } from '@/shared/dtos/email-route';

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

  const contentLength = response.headers.get('Content-Length');
  if (contentLength === '0' || !response.body) {
    return;
  }

  try {
    return await response.json();
  } catch {
    return;
  }
}

export interface LoginResponse {
  token: string;
}

export interface ForwardToEmailResponse {
  email: string;
}

export const apiClient = {
  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeAuthToken() {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
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

  async createEmailRoute(data: Omit<EmailRouteDto, 'id'>): Promise<void> {
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

  async updateEmailRoute(id: number, data: Omit<EmailRouteDto, 'id'>): Promise<void> {
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
};

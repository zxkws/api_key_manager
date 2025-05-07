import { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://apikeymanage.lookli.nyc.mn/api';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'https://zxkws.nyc.mn';

export class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private handleUnauthorized() {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `${AUTH_URL}/login?redirect=${currentUrl}`;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders();
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        this.handleUnauthorized();
        throw new ApiError('Unauthorized', 401);
      }

      if (!response.ok) {
        throw new ApiError(`HTTP error! Status: ${response.status}`, response.status);
      }

      // For DELETE requests, return void
      if (options.method === 'DELETE') {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'An unknown error occurred',
        500
      );
    }
  }

  protected get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  protected post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  protected put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  protected delete(endpoint: string): Promise<void> {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

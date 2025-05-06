import { ApiKey } from '../types';
import { ApiClient } from './apiClient';

class ApiKeyService extends ApiClient {
  async fetchApiKeys(): Promise<ApiKey[]> {
    return this.get<ApiKey[]>('/api-keys');
  }

  async fetchApiKeyById(id: string): Promise<ApiKey> {
    return this.get<ApiKey>(`/api-keys/${id}`);
  }

  async createApiKey(apiKeyData: Omit<ApiKey, 'id'>): Promise<ApiKey> {
    return this.post<ApiKey>('/api-keys', apiKeyData);
  }

  async updateApiKey(id: string, apiKeyData: Partial<ApiKey>): Promise<ApiKey> {
    return this.put<ApiKey>(`/api-keys/${id}`, apiKeyData);
  }

  async deleteApiKey(id: string): Promise<void> {
    return this.delete(`/api-keys/${id}`);
  }
}

const apiKeyService = new ApiKeyService();

export const {
  fetchApiKeys,
  fetchApiKeyById,
  createApiKey,
  updateApiKey,
  deleteApiKey,
} = apiKeyService;
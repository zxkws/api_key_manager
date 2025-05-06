export interface ApiKey {
  id: string;
  name: string;
  key: string;
  baseUrl: string;
  model: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ApiKeyFormData {
  name: string;
  key: string;
  baseUrl: string;
  model: string;
  description: string;
  category: string;
  isActive: boolean;
}
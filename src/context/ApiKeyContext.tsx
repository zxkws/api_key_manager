import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ApiKey } from '../types';
import { fetchApiKeys, createApiKey, updateApiKey, deleteApiKey } from '../services/apiService';

interface ApiKeyContextType {
  apiKeys: ApiKey[];
  loading: boolean;
  error: string | null;
  refreshApiKeys: () => Promise<void>;
  addApiKey: (apiKey: Omit<ApiKey, 'id'>) => Promise<ApiKey>;
  editApiKey: (id: string, apiKey: Partial<ApiKey>) => Promise<ApiKey>;
  removeApiKey: (id: string) => Promise<void>;
  getApiKeyById: (id: string) => ApiKey | undefined;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApiKeys();
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Failed to fetch API keys:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addApiKey = async (apiKey: Omit<ApiKey, 'id'>): Promise<ApiKey> => {
    try {
      const newApiKey = await createApiKey(apiKey);
      setApiKeys(prevKeys => [...prevKeys, newApiKey]);
      return newApiKey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add API key');
      throw err;
    }
  };

  const editApiKey = async (id: string, apiKey: Partial<ApiKey>): Promise<ApiKey> => {
    try {
      const updatedApiKey = await updateApiKey(id, apiKey);
      setApiKeys(prevKeys => 
        prevKeys.map(key => key.id === id ? updatedApiKey : key)
      );
      return updatedApiKey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update API key');
      throw err;
    }
  };

  const removeApiKey = async (id: string): Promise<void> => {
    try {
      await deleteApiKey(id);
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
      throw err;
    }
  };

  const getApiKeyById = (id: string): ApiKey | undefined => {
    return apiKeys.find(key => key.id === id);
  };

  useEffect(() => {
    refreshApiKeys();
  }, []);

  return (
    <ApiKeyContext.Provider value={{
      apiKeys,
      loading,
      error,
      refreshApiKeys,
      addApiKey,
      editApiKey,
      removeApiKey,
      getApiKeyById,
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKeys must be used within an ApiKeyProvider');
  }
  return context;
};
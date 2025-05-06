import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiKeyForm from '../components/ApiKeyForm';
import { useApiKeys } from '../context/ApiKeyContext';
import { ApiKeyFormData } from '../types';

const EditApiKey: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApiKeyById, editApiKey } = useApiKeys();
  const [initialData, setInitialData] = useState<ApiKeyFormData | null>(null);
  
  useEffect(() => {
    if (id) {
      const apiKey = getApiKeyById(id);
      if (apiKey) {
        setInitialData({
          name: apiKey.name,
          key: apiKey.key,
          baseUrl: apiKey.baseUrl,
          model: apiKey.model,
          description: apiKey.description,
          category: apiKey.category,
          isActive: apiKey.isActive,
        });
        document.title = `API Key Manager | Edit ${apiKey.name}`;
      } else {
        navigate('/not-found');
      }
    }
  }, [id, getApiKeyById, navigate]);
  
  const handleSubmit = async (data: ApiKeyFormData) => {
    if (!id) return;
    
    try {
      await editApiKey(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update API key:', error);
      throw error;
    }
  };
  
  if (!initialData) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <ApiKeyForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        isEditing 
      />
    </div>
  );
};

export default EditApiKey;
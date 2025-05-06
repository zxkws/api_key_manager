import React from 'react';
import ApiKeyForm from '../components/ApiKeyForm';
import { useApiKeys } from '../context/ApiKeyContext';
import { ApiKeyFormData } from '../types';

const CreateApiKey: React.FC = () => {
  const { addApiKey } = useApiKeys();
  
  React.useEffect(() => {
    document.title = 'API Key Manager | Create New API Key';
  }, []);
  
  const handleSubmit = async (data: ApiKeyFormData) => {
    try {
      await addApiKey({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error; // Re-throw to let the form component handle the error
    }
  };
  
  return (
    <div>
      <ApiKeyForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateApiKey;
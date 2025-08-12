import axios from 'axios';
import { SERVER_URL } from '../utils/constants';
import { getBearerToken } from '../utils/localStorage';
import { api } from './apiUtils'
import { PresignedUrlResponse } from '../types';

function handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
    }
    throw error;
}

export const getPresignedUrl = async (file: File): Promise<PresignedUrlResponse> => {
  try {
    const response = await api.post('/libraries/presigned-url', {
      fileName: file.name,
      fileType: file.type,
    });

    // The backend response structure is: { presignedUrl: string, key: string, expiresIn: number }
    const responseData = response.data;
    if (!responseData.presignedUrl || !responseData.key) {
      throw new Error('Invalid response structure from getPresignedUrl');
    }

    return {
      presignedUrl: responseData.presignedUrl,
      key: responseData.key,
    };
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const uploadFileToS3 = async (presignedUrl: string, file: File) => {
  try {
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`S3 upload failed: ${uploadResponse.status} ${errorText}`);
    }

    return uploadResponse;
  } catch (err) {
    console.error('Error uploading file to S3:', err);
    throw err;
  }
};

export const notifyBackendOfUpload = async (data: {
  projectId: string;
  key: string;
  fileName: string;
  fileType: string;
  size: number;
  isGlobal: boolean;
}) => {
  try {
    const response = await api.post('/libraries/upload', data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getAllLibraryItems = async () => {
  try {
    const response = await api.get('/libraries');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getLibraryItemViewUrl = async (id: string) => {
  try {
    const response = await api.get(`/libraries/${id}/view`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const toggleGlobalStatus = async (id: string) => {
  try {
    const response = await api.put(`/libraries/${id}/toggle-global`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getProjectLibraryItems = async (projectId: string) => {
  const response = await api.get(`/libraries/projects/${projectId}`)
  return response.data
}

export const addLibraryItemToNote = async (noteId: string, libraryItemId: string) => {
  const response = await api.post(`/notes/${noteId}/library-items/${libraryItemId}`)
  return response.data
}

export const removeLibraryItemFromNote = async (noteId: string, libraryItemId: string) => {
  const response = await api.delete(`/notes/${noteId}/library-items/${libraryItemId}`)
  return response.data
}

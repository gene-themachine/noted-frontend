import { api } from './apiUtils';
import { SERVER_URL } from '../utils/constants';

export interface GenerateQAPayload {
  noteId: string;
  qaBlockId: string;
  question: string;
}

export interface QAResponse {
  success: boolean;
  data?: {
    qaBlockId: string;
    question: string;
    answer: string;
  };
  message?: string;
}

export interface QAStreamEvent {
  type: 'status' | 'chunk' | 'complete' | 'error';
  data: {
    status?: string;
    chunk?: string;
    accumulatedAnswer?: string;
    answer?: string;
    error?: string;
    qaBlockId: string;
  };
}

export const generateQA = async (payload: GenerateQAPayload) => {
  const response = await api.post(`/notes/${payload.noteId}/qa/generate`, {
    qaBlockId: payload.qaBlockId,
    question: payload.question,
  });
  return response.data;
};

export const streamQA = (
  payload: GenerateQAPayload,
  onChunk: (chunk: string, accumulatedAnswer: string) => void,
  onComplete: (answer: string) => void,
  onError: (error: string) => void
): EventSource => {
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Create EventSource with all parameters in query string
  const baseUrl = SERVER_URL.replace(/\/+$/, '');
  const url = new URL(`${baseUrl}/notes/${payload.noteId}/qa/stream`);
  url.searchParams.set('auth_token', token || '');
  url.searchParams.set('qaBlockId', payload.qaBlockId);
  url.searchParams.set('question', payload.question);
  
  console.log('🔄 Creating EventSource for Q&A streaming:', url.toString());
  const eventSource = new EventSource(url.toString());

  eventSource.onopen = (event) => {
    console.log('✅ EventSource connection opened:', event);
    console.log('📡 Connection state:', eventSource.readyState);
  };

  eventSource.onmessage = (event) => {
    console.log('📨 Received SSE message:', event.data);
    try {
      const data: QAStreamEvent = JSON.parse(event.data);
      
      switch (data.type) {
        case 'status':
          console.log('Q&A streaming started:', data.data.status);
          break;
          
        case 'chunk':
          if (data.data.chunk && data.data.accumulatedAnswer) {
            onChunk(data.data.chunk, data.data.accumulatedAnswer);
          }
          break;
          
        case 'complete':
          if (data.data.answer) {
            onComplete(data.data.answer);
          }
          eventSource.close();
          break;
          
        case 'error':
          onError(data.data.error || 'Unknown error occurred');
          eventSource.close();
          break;
      }
    } catch (error) {
      console.error('Failed to parse SSE data:', error);
      onError('Failed to parse server response');
      eventSource.close();
    }
  };

  eventSource.onerror = (error) => {
    console.error('❌ EventSource error:', error);
    console.error('📡 Connection state during error:', eventSource.readyState);
    console.error('📡 EventSource URL:', url.toString());
    
    // Check if it's a connection error vs other error
    if (eventSource.readyState === EventSource.CLOSED) {
      onError('Connection closed unexpectedly');
    } else if (eventSource.readyState === EventSource.CONNECTING) {
      onError('Failed to connect to server');
    } else {
      onError('Connection error occurred');
    }
    
    eventSource.close();
  };

  return eventSource;
};
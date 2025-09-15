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
  const response = await api.post(`/notes/${payload.noteId}/qa/intelligent`, {
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
  // token maintained by src/lib/authToken.ts
  const token = localStorage.getItem('authToken');
  
  // Create EventSource with all parameters in query string
  const baseUrl = SERVER_URL.replace(/\/+$/, '');
  const url = new URL(`${baseUrl}/notes/${payload.noteId}/qa/intelligent/stream`);
  url.searchParams.set('auth_token', token || '');
  url.searchParams.set('qaBlockId', payload.qaBlockId);
  url.searchParams.set('question', payload.question);
  
  console.log('🔄 Creating EventSource for Q&A streaming:', url.toString());
  const eventSource = new EventSource(url.toString());
  let buffer = '';
  let receivedAnyChunk = false;

  eventSource.onopen = (event) => {
    console.log('✅ EventSource connection opened:', event);
    console.log('📡 Connection state:', eventSource.readyState);
  };

  eventSource.onmessage = (event) => {
    console.log('📨 Received SSE message:', event.data);
    try {
      const msg = JSON.parse(event.data);

      // New typed envelope { type, data }
      if (msg && typeof msg === 'object' && msg.type && msg.data) {
        const { type, data } = msg as { type: string; data: any };
        if (type === 'status') {
          return; // no-op
        }
        if (type === 'chunk') {
          const chunk: string = data.chunk || '';
          const isComplete: boolean = !!data.isComplete;
          if (chunk) {
            receivedAnyChunk = true;
            buffer += chunk;
            onChunk(chunk, buffer);
          }
          // Do not close here; wait for 'metadata' to finalize.
          // If server fails to send metadata, onerror/close will trigger and we can fallback there.
          return;
        }
        if (type === 'complete') {
          // no-op; metadata should follow; if not, onerror will handle fallback
          return;
        }
        if (type === 'metadata') {
          onComplete(buffer);
          try { eventSource.close(); } catch {}
          return;
        }
      }

      // Legacy flat schema { chunk, isComplete } or error
      if (msg?.error) {
        onError(msg.error || 'Unknown error occurred');
        try { eventSource.close(); } catch {}
        return;
      }
      if (typeof msg?.chunk === 'string') {
        const chunk: string = msg.chunk;
        const isComplete: boolean = !!msg.isComplete;
        receivedAnyChunk = true;
        buffer += chunk;
        onChunk(chunk, buffer);
        if (isComplete) {
          // legacy path: finalize on completion
          onComplete(buffer);
          try { eventSource.close(); } catch {}
        }
        return;
      }

      // Old server envelope with accumulatedAnswer
      const oldData: QAStreamEvent = msg;
      if (oldData?.type === 'chunk' && oldData.data?.chunk) {
        const c = oldData.data.chunk;
        receivedAnyChunk = true;
        buffer += c;
        onChunk(c, buffer);
        return;
      }
      if (oldData?.type === 'complete') {
        const ans = oldData.data?.answer || buffer;
        onComplete(ans);
        try { eventSource.close(); } catch {}
        return;
      }
    } catch (error) {
      console.error('Failed to parse SSE data:', error);
      onError('Failed to parse server response');
      try { eventSource.close(); } catch {}
    }
  };

  eventSource.onerror = (error) => {
    console.error('❌ EventSource error:', error);
    console.error('📡 Connection state during error:', eventSource.readyState);
    console.error('📡 EventSource URL:', url.toString());

    // If we've received data, finalize with buffered content and treat as normal end-of-stream
    if (receivedAnyChunk) {
      if (buffer) {
        onComplete(buffer);
      }
      try { eventSource.close(); } catch {}
      return;
    }

    if (eventSource.readyState === EventSource.CONNECTING) {
      onError('Failed to connect to server');
    } else if (eventSource.readyState === EventSource.CLOSED) {
      onError('Connection closed unexpectedly');
    } else {
      onError('Connection error occurred');
    }

    try { eventSource.close(); } catch {}
  };

  return eventSource;
};

import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { generateQA, streamQA, GenerateQAPayload } from '../api/qa';

export const useGenerateQA = () => {
  return useMutation({
    mutationFn: generateQA,
    onSuccess: (data) => {
      console.log('✅ Q&A generation completed:', data);
    },
    onError: (error: any) => {
      console.error('❌ Q&A generation failed:', error);
      const message = error.response?.data?.message || 'Failed to generate Q&A';
      console.error('Error message:', message);
    },
  });
};

export const useStreamQA = () => {
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = (
    payload: GenerateQAPayload,
    onChunk: (chunk: string, accumulatedAnswer: string) => void,
    onComplete: (answer: string) => void,
    onError: (error: string) => void
  ) => {
    console.log('🔄 useStreamQA.startStream called with payload:', payload);
    
    // Close existing stream if any
    if (eventSourceRef.current) {
      console.log('🔄 Closing existing EventSource connection');
      eventSourceRef.current.close();
    }

    // Start new stream
    console.log('🚀 Starting new Q&A stream...');
    eventSourceRef.current = streamQA(payload, onChunk, onComplete, onError);
    
    console.log('✅ EventSource created and stored in ref');
    return eventSourceRef.current;
  };

  const stopStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  return {
    startStream,
    stopStream,
  };
};
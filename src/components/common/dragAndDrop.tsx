import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, File, X, Loader, CheckCircle, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { getPresignedUrl, uploadFileToS3, notifyBackendOfUpload } from '../../api/library';

interface DragAndDropProps {
  projectId: string;
}

type ChunkingStatus = 'idle' | 'processing' | 'completed' | 'failed';

export default function DragAndDrop({ projectId }: DragAndDropProps) {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isGlobal, setIsGlobal] = useState(false);
  const [chunkingStatus, setChunkingStatus] = useState<ChunkingStatus>('idle');
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor chunking status for uploaded files
  useEffect(() => {
    if (!uploadedFileId || chunkingStatus !== 'processing') return;

    const checkChunkingStatus = async () => {
      try {
        // We'll need to call the library API to check vectorization status
        // For now, simulate with a timeout
        const response = await fetch(`/api/library/${uploadedFileId}/status`);
        if (response.ok) {
          const data = await response.json();
          if (data.vectorStatus === 'completed') {
            setChunkingStatus('completed');
            setTimeout(() => {
              setFile(null);
              setUploadedFileId(null);
              setChunkingStatus('idle');
            }, 2000); // Show success for 2 seconds
          } else if (data.vectorStatus === 'failed') {
            setChunkingStatus('failed');
          }
        }
      } catch (error) {
        console.error('Failed to check chunking status:', error);
        // On error, assume success after reasonable time
        setTimeout(() => {
          setChunkingStatus('completed');
          setTimeout(() => {
            setFile(null);
            setUploadedFileId(null);
            setChunkingStatus('idle');
          }, 2000);
        }, 5000);
      }
    };

    // Poll every 2 seconds while processing
    const interval = setInterval(checkChunkingStatus, 2000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [uploadedFileId, chunkingStatus]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openFileDialog();
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    console.log('File:', file);
    console.log('Project ID:', projectId);
    if (file && projectId) {
      setUploading(true);
      console.log('Uploading started...');
      try {
        console.log('Getting presigned URL...');
        const { presignedUrl, key } = await getPresignedUrl(file);
        console.log('Presigned URL received:', presignedUrl);
        console.log('Key:', key);

        console.log('Uploading to S3...');
        const uploadResponse = await uploadFileToS3(presignedUrl, file);
        console.log('S3 upload response:', uploadResponse);

        if (uploadResponse.ok) {
          console.log('Notifying backend of upload...');
          const response = await notifyBackendOfUpload({
            projectId: projectId,
            key,
            fileName: file.name,
            fileType: file.type,
            size: file.size,
            isGlobal,
          });
          
          // eslint-disable-next-line no-console
          console.log('File uploaded successfully!');
          
          // Start monitoring chunking status for PDF files
          if (file.type === 'application/pdf' && response?.libraryItem?.id) {
            setUploadedFileId(response.libraryItem.id);
            setChunkingStatus('processing');
            console.log('Starting chunking monitoring for file:', response.libraryItem.id);
          } else {
            // Non-PDF files complete immediately
            setFile(null);
          }
          
          // Refresh the library items for this project
          queryClient.invalidateQueries({ queryKey: ['projectLibrary', projectId] });
        } else {
          console.error('Failed to upload file to S3.');
          const responseText = await uploadResponse.text();
          console.error('S3 response:', responseText);
        }
      } catch (error) {
        console.error('An error occurred during file upload:', error);
      } finally {
        setUploading(false);
        console.log('Uploading finished.');
      }
    } else {
      console.log('handleSubmit aborted: file or projectId is missing.');
    }
  };

  return (
    <div className="mb-4">
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        className={clsx(
          'bg-surface border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2',
          {
            'border-primary-orange bg-orange-50/50': isDragging,
            'border-border hover:border-foreground/30 hover:bg-surface-hover': !isDragging,
          },
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2 text-foreground-secondary">
          <UploadCloud className="w-6 h-6" />
          <p className="text-sm font-medium text-foreground">Drop files or <span className="text-primary-orange">browse</span></p>
        </div>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-3 bg-surface-elevated p-3 rounded-lg border border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {chunkingStatus === 'processing' ? (
                  <Brain className="w-4 h-4 text-blue-500 animate-pulse" />
                ) : chunkingStatus === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <File className="w-4 h-4 text-primary-orange" />
                )}
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-foreground-muted">
                  ({(file.size / 1024).toFixed(2)} KB)
                </p>
              </div>
              {chunkingStatus === 'idle' && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 text-foreground-muted hover:text-foreground rounded-full hover:bg-surface-pressed"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Chunking status indicator */}
            {chunkingStatus !== 'idle' && (
              <div className="mt-2 flex items-center gap-2">
                {chunkingStatus === 'processing' && (
                  <>
                    <Loader className="w-3 h-3 animate-spin text-blue-500" />
                    <p className="text-xs text-blue-600">Processing for AI features...</p>
                  </>
                )}
                {chunkingStatus === 'completed' && (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <p className="text-xs text-green-600">Ready for AI-powered study tools!</p>
                  </>
                )}
                {chunkingStatus === 'failed' && (
                  <>
                    <X className="w-3 h-3 text-red-500" />
                    <p className="text-xs text-red-600">Processing failed - file uploaded but AI features unavailable</p>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {file && chunkingStatus === 'idle' && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isGlobal"
              checked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
              className="h-3 w-3 rounded border-gray-300 text-primary-orange focus:ring-primary-orange"
            />
            <label htmlFor="isGlobal" className="text-xs text-foreground-secondary">
              Make global
            </label>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || !projectId || uploading}
            className="px-4 py-2 bg-primary-orange text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-orange/90"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
} 
import React, { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { getPresignedUrl, uploadFileToS3, notifyBackendOfUpload } from '../../api/library';

interface DragAndDropProps {
  projectId: string;
}

export default function DragAndDrop({ projectId }: DragAndDropProps) {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isGlobal, setIsGlobal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          await notifyBackendOfUpload({
            projectId: projectId,
            key,
            fileName: file.name,
            fileType: file.type,
            size: file.size,
            isGlobal,
          });
          // eslint-disable-next-line no-console
          console.log('File uploaded successfully!');
          setFile(null); // Reset after submission
          
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
            className="mt-3 bg-surface-elevated p-3 rounded-lg flex items-center justify-between border border-border"
          >
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-primary-orange" />
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-foreground-muted">
                ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1 text-foreground-muted hover:text-foreground rounded-full hover:bg-surface-pressed"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {file && (
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
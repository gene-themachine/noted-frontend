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
          queryClient.invalidateQueries({ queryKey: ['libraryItems', projectId] });
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
    <div className="mb-8">
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        className={clsx(
          'bg-surface border border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2 focus:ring-offset-background',
          {
            'border-primary-orange bg-orange-50 scale-105 shadow-lg': isDragging,
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
        <div className="flex flex-col items-center justify-center space-y-3 text-foreground-secondary">
          <UploadCloud className="w-10 h-10" />
          <h2 className="text-lg font-semibold text-foreground">Attach a file</h2>
          <p className="text-sm">Drag & drop or <span className="text-primary-orange font-semibold">click to browse</span></p>
        </div>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bg-surface-elevated p-4 rounded-xl flex items-center justify-between border border-border"
          >
            <div className="flex items-center gap-3">
              <File className="w-6 h-6 text-primary-orange" />
              <p className="text-foreground font-medium">{file.name}</p>
              <p className="text-sm text-foreground-muted">
                ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1.5 text-foreground-muted hover:text-foreground rounded-full hover:bg-surface-pressed"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="isGlobal"
          checked={isGlobal}
          onChange={(e) => setIsGlobal(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary-orange focus:ring-primary-orange"
        />
        <label htmlFor="isGlobal" className="ml-2 block text-sm text-foreground">
          Make this file global
        </label>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || !projectId || uploading}
          className="w-full px-6 py-3 bg-primary-orange text-white font-bold rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
} 
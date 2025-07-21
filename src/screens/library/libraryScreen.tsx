import React from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, FileImage, MoreVertical, Loader, CheckSquare, Square } from 'lucide-react';
import DragAndDrop from '../../components/common/dragAndDrop';
import { useProjectLibraryItems } from '../../hooks/library';
import { LibraryItem } from '../../types';
import { useParams } from 'react-router-dom';
import { getLibraryItemViewUrl, toggleGlobalStatus } from '../../api/library';

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return <FileImage className="w-8 h-8 text-blue-500" />;
  }
  if (type === 'application/pdf') {
    return <FileText className="w-8 h-8 text-red-500" />;
  }
  return <FileText className="w-8 h-8 text-gray-500" />;
};

export default function LibraryScreen() {
  const queryClient = useQueryClient();
  const { projectId } = useParams<{ projectId: string }>();
  const { data: files, isLoading, error } = useProjectLibraryItems(projectId!);

  const toggleGlobalMutation = useMutation({
    mutationFn: toggleGlobalStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryItems', projectId] });
    },
  });

  const handleFileClick = async (file: LibraryItem) => {
    try {
      const { url } = await getLibraryItemViewUrl(file.id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Could not get viewable URL', err);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-foreground mb-8">Library</h1>

      {/* File Upload Dropdown Box */}
      <DragAndDrop projectId={projectId!} />

      {/* File List */}
      <div className="flex-1 overflow-y-auto mt-4">
        <h2 className="text-xl font-bold text-foreground mb-4">Uploaded Files</h2>
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-red-500">Could not load files.</p>}
        {!isLoading && !error && (
          <div className="space-y-3">
            {files && files.length > 0 ? (
              files.map((file: LibraryItem, i: number) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface p-4 rounded-lg flex items-center justify-between border border-border hover:shadow-md transition-shadow"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => handleFileClick(file)}
                  >
                    {getFileIcon(file.mimeType)}
                    <div>
                      <p className="font-semibold text-foreground">{file.name}</p>
                      <p className="text-sm text-foreground-secondary">
                        {(file.size / 1024).toFixed(2)} KB - Added on{' '}
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleGlobalMutation.mutate(file.id)}
                      className="p-1 rounded-full text-foreground-muted hover:text-primary-green"
                      aria-label={file.isGlobal ? 'Mark as not global' : 'Mark as global'}
                    >
                      {file.isGlobal ? (
                        <CheckSquare className="w-5 h-5 text-primary-green" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="p-2 text-foreground-muted rounded-full hover:bg-surface-hover hover:text-foreground"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
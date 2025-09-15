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
    return <FileImage className="w-5 h-5 text-primary-blue" />;
  }
  if (type === 'application/pdf') {
    return <FileText className="w-5 h-5 text-red-500" />;
  }
  return <FileText className="w-5 h-5 text-foreground-secondary" />;
};

export default function LibraryScreen() {
  const queryClient = useQueryClient();
  const { projectId } = useParams<{ projectId: string }>();
  const { data: files, isLoading, error } = useProjectLibraryItems(projectId!);

  const toggleGlobalMutation = useMutation({
    mutationFn: toggleGlobalStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectLibrary', projectId] });
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
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-foreground mb-6">Library</h1>

      {/* File Upload Dropdown Box */}
      <DragAndDrop projectId={projectId!} />

      {/* File List */}
      <div className="flex-1 overflow-y-auto mt-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Files</h2>
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-red-500">Could not load files.</p>}
        {!isLoading && !error && (
          <div className="space-y-2">
            {files && files.length > 0 ? (
              files.map((file: LibraryItem, i: number) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface p-3 rounded-lg flex items-center justify-between border border-border hover:bg-surface-hover transition-all duration-200"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => handleFileClick(file)}
                  >
                    {getFileIcon(file.mimeType)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-foreground-secondary">
                        {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleGlobalMutation.mutate(file.id)}
                      className="p-1 rounded-full text-foreground-muted hover:text-primary-green transition-colors"
                      aria-label={file.isGlobal ? 'Mark as not global' : 'Mark as global'}
                    >
                      {file.isGlobal ? (
                        <CheckSquare className="w-4 h-4 text-primary-green" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="p-1 text-foreground-muted rounded-full hover:bg-surface-pressed hover:text-foreground transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-foreground-secondary text-sm text-center py-8">No files uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


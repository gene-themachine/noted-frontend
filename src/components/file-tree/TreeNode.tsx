import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TreeNode as TreeNodeType } from '../../types';
import AddItemModal from '../common/AddItemModal';
import {
  useCreateNote,
  useCreateFolder,
  useDeleteFolder,
} from '../../hooks/note';

interface TreeNodeProps {
  node: TreeNodeType;
  path: string[];
  projectId: string;
  onMobileClose?: () => void;
}

export default function TreeNode({ node, path, projectId, onMobileClose }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const createNoteMutation = useCreateNote();
  const createFolderMutation = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder();
  const navigate = useNavigate();

  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      navigate(`/project/${projectId}/note/${node.noteId}`);
      // Close mobile sidebar when navigating to a note
      onMobileClose?.();
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleModalSubmit = (type: 'folder' | 'note', name: string) => {
    const newPath = [...path, node.id];
    if (type === 'note') {
      createNoteMutation.mutate({ projectId, name, folderPath: newPath });
    } else {
      createFolderMutation.mutate({ projectId, name, folderPath: newPath });
    }
    setIsModalOpen(false);
    setIsOpen(true); // Open the folder to show the new item
  };

  const handleDeleteConfirm = () => {
    if (isFolder) {
      deleteFolderMutation.mutate(node.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="my-1"
      >
        <div
          className="flex items-start justify-between w-full p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-start min-w-0">
            <span className="flex items-center h-6 flex-shrink-0">
              {isFolder && (
                <ChevronRight
                  className={`w-4 h-4 mr-2 transition-transform ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
              )}
              {isFolder ? (
                <Folder className="w-5 h-5 mr-3 text-gray-600" />
              ) : (
                <FileText className="w-5 h-5 ml-6 mr-3 text-gray-500" />
              )}
            </span>
            <span className="text-sm font-medium text-gray-800 pt-0.5 break-words whitespace-normal">
              {node.name}
            </span>
          </div>

          <AnimatePresence>
            {isFolder && isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center flex-shrink-0 ml-1"
              >
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  aria-label="Add item"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Delete folder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isOpen && isFolder && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-6"
            >
              {node.children.map((child) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  path={[...path, node.id]}
                  projectId={projectId}
                  onMobileClose={onMobileClose}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        theme="light"
      />
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Delete Folder
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{node.name}&quot; and all its
              contents? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteFolderMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteFolderMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

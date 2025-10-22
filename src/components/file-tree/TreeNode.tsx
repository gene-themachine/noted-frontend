import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ChevronRight, Trash2, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TreeNode as TreeNodeType } from '../../types';
import AddItemModal from '@/components/modals/AddItemModal';
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
  activeId?: string | null;
  overId?: string | null;
}

export default function TreeNode({ node, path, projectId, onMobileClose, activeId, overId }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [suppressClick, setSuppressClick] = useState(false);
  const wasDraggingRef = useRef(false);
  const createNoteMutation = useCreateNote();
  const createFolderMutation = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder();
  const navigate = useNavigate();

  const isFolder = node.type === 'folder';

  // Setup drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isBeingDragged = activeId === node.id;
  const isDropTarget = overId === node.id;

  // Prevent "ghost" clicks after a drag ends
  useEffect(() => {
    if (isDragging) {
      wasDraggingRef.current = true;
      return;
    }
    if (wasDraggingRef.current) {
      setSuppressClick(true);
      const t = setTimeout(() => {
        setSuppressClick(false);
        wasDraggingRef.current = false;
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isDragging]);

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate/toggle if currently dragging
    if (isBeingDragged || isDragging || suppressClick) {
      e.preventDefault();
      return;
    }

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
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
        ref={setNodeRef}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="my-0.5"
      >
        <div
          className={`group flex items-start justify-between w-full px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200 border ${
            isBeingDragged
              ? 'opacity-50 border-primary-blue bg-blue-50'
              : isDropTarget
              ? 'border-primary-blue bg-blue-50 shadow-md'
              : 'border-transparent hover:border-gray-200'
          }`}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick(e as any)}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-start min-w-0">
            <span className="flex items-center h-6 flex-shrink-0">
              {/* Drag handle */}
              <span
                className="mr-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing select-none"
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                role="button"
                aria-label="Drag handle"
              >
                <GripVertical className="w-4 h-4" />
              </span>
              {isFolder && (
                <ChevronRight
                  className={`w-4 h-4 mr-2 text-gray-500 transition-all duration-200 ${
                    isOpen ? 'rotate-90 text-primary-blue' : ''
                  }`}
                />
              )}
              {isFolder ? (
                <Folder className="w-5 h-5 mr-3 text-primary-blue transition-colors duration-200 group-hover:text-hover-blue" />
              ) : (
                <FileText className="w-5 h-5 ml-6 mr-3 text-gray-500 transition-colors duration-200 group-hover:text-gray-700" />
              )}
            </span>
            <span className="text-sm font-medium text-gray-800 pt-0.5 break-words whitespace-normal group-hover:text-gray-900 transition-colors duration-200">
              {node.name}
            </span>
          </div>

          <AnimatePresence>
            {isFolder && isHovered && !isBeingDragged && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1 flex-shrink-0 ml-2"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-all duration-200 text-base font-semibold"
                  aria-label="Add item"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  aria-label="Delete folder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="pl-6 overflow-hidden"
            >
              <SortableContext
                items={node.children.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {node.children.map((child) => (
                  <TreeNode
                    key={child.id}
                    node={child}
                    path={[...path, node.id]}
                    projectId={projectId}
                    onMobileClose={onMobileClose}
                    activeId={activeId}
                    overId={overId}
                  />
                ))}
              </SortableContext>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isModalOpen && createPortal(
        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          theme="light"
        />,
        document.body
      )}

      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-floating-lg border border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Delete Folder
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <span className="font-semibold text-gray-900">&quot;{node.name}&quot;</span> and all its contents? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteFolderMutation.isPending}
                className="px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
              >
                {deleteFolderMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

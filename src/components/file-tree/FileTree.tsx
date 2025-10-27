import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Folder, FileText, GripVertical, ChevronRight } from 'lucide-react';
import TreeNode from './TreeNode';
import { FolderNode, TreeNode as TreeNodeType } from '../../types';
import { useMoveNode, useReorderNodes } from '../../hooks/note';

interface FileTreeProps {
  root?: FolderNode;
  projectId: string;
  onMobileClose?: () => void;
}

export default function FileTree({ root, projectId, onMobileClose }: FileTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const moveNodeMutation = useMoveNode();
  const reorderNodesMutation = useReorderNodes();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  );

  // Custom modifier to position drag handle under cursor
  // DragOverlay structure: px-3 (12px), py-2.5 (10px), h-6 span (24px), w-4 icon (16px)
  const cursorAtDragHandle = ({ transform }: { transform: { x: number; y: number } }) => {
    return {
      ...transform,
      x: transform.x - 20, // 12px padding + 8px (half icon width)
      y: transform.y - 22, // 10px padding + 12px (half span height)
    };
  };

  if (!root) {
    return null;
  }

  // Helper to find a node and its parent in the tree
  const findNodeAndParent = (
    tree: TreeNodeType,
    nodeId: string,
    parent: FolderNode | null = null
  ): { node: TreeNodeType; parent: FolderNode | null } | null => {
    if (tree.id === nodeId) {
      return { node: tree, parent };
    }

    if (tree.type === 'folder' && tree.children) {
      for (const child of tree.children) {
        if (child.id === nodeId) {
          return { node: child, parent: tree };
        }
        if (child.type === 'folder') {
          const result = findNodeAndParent(child, nodeId, tree);
          if (result) return result;
        }
      }
    }

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const getActiveNode = (): TreeNodeType | null => {
    if (!activeId) return null;
    const result = findNodeAndParent(root, activeId);
    return result?.node || null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeNodeResult = findNodeAndParent(root, active.id as string);
    const overNodeResult = findNodeAndParent(root, over.id as string);

    if (!activeNodeResult || !overNodeResult) {
      return;
    }

    const { node: activeNode, parent: activeParent } = activeNodeResult;
    const { node: overNode, parent: overParent } = overNodeResult;

    // Prevent dropping a folder into itself or one of its descendants
    const isDescendant = (parentNode: FolderNode, maybeDescendantId: string): boolean => {
      for (const child of parentNode.children) {
        if (child.id === maybeDescendantId) return true;
        if (child.type === 'folder' && isDescendant(child as FolderNode, maybeDescendantId)) return true;
      }
      return false;
    };
    if (activeNode.type === 'folder') {
      // overNode could be the folder itself or any of its descendants
      if (activeNode.id === overNode.id) return;
      if (overNode.type === 'folder' && isDescendant(activeNode as FolderNode, overNode.id)) return;
      if (overParent && isDescendant(activeNode as FolderNode, overParent.id)) return;
    }

    // Determine the target parent for the drop
    let targetParent: FolderNode;
    let targetIndex: number;

    if (overNode.type === 'folder') {
      // Dropping onto a folder - add as first child
      targetParent = overNode as FolderNode;
      targetIndex = 0;
    } else {
      // Dropping onto a note - insert in the same parent at the note's position
      if (!overParent) return;
      targetParent = overParent;
      const overIndex = overParent.children.findIndex(c => c.id === over.id);
      targetIndex = overIndex;
    }

    // Check if this is a reorder (same parent) or a move (different parent)
    const isSameParent = activeParent?.id === targetParent.id;

    if (isSameParent && activeParent) {
      // Reorder within the same parent
      const children = activeParent.children;
      const oldIndex = children.findIndex(c => c.id === active.id);
      const newIndex = children.findIndex(c => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedChildren = arrayMove(children, oldIndex, newIndex);
        const childIds = reorderedChildren.map(c => c.id);

        reorderNodesMutation.mutate({
          projectId,
          parentId: activeParent.id,
          childIds,
        });
      }
    } else {
      // Move to a different parent
      moveNodeMutation.mutate({
        projectId,
        nodeId: active.id as string,
        newParentId: targetParent.id,
        newIndex: targetIndex,
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  // Top-level SortableContext should include only the root's direct children (visible at this level)
  const topLevelIds = root.children.map((c) => c.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
        <div className="font-helvetica">
          {root.children.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              path={[]}
              projectId={projectId}
              onMobileClose={onMobileClose}
              activeId={activeId}
              overId={overId}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={null} modifiers={[cursorAtDragHandle]}>
        {activeId ? (
          <div className="bg-white rounded-xl shadow-floating-lg px-3 py-2.5 border-2 border-primary-blue cursor-grabbing">
            <div className="flex items-center">
              {/* Match the exact structure from TreeNode */}
              <span className="flex items-center h-6 flex-shrink-0">
                <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
                {getActiveNode()?.type === 'folder' && (
                  <ChevronRight className="w-4 h-4 mr-2 text-primary-blue rotate-90" />
                )}
                {getActiveNode()?.type === 'folder' ? (
                  <Folder className="w-5 h-5 mr-3 text-primary-blue" />
                ) : (
                  <FileText className="w-5 h-5 ml-6 mr-3 text-gray-500" />
                )}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {getActiveNode()?.name || 'Dragging...'}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

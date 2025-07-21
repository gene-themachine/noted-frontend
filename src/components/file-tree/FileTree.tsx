import React from 'react';
import TreeNode from './TreeNode';
import { FolderNode } from '../../types';

interface FileTreeProps {
  root?: FolderNode;
  projectId: string;
  onMobileClose?: () => void;
}

export default function FileTree({ root, projectId, onMobileClose }: FileTreeProps) {
  if (!root) {
    return null;
  }
  return (
    <div className="font-helvetica">
      {root.children.map((node) => (
        <TreeNode key={node.id} node={node} path={[]} projectId={projectId} onMobileClose={onMobileClose} />
      ))}
    </div>
  );
}

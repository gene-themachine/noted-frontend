// Types for the file tree structure
export type FileNode = {
  id: string;
  name: string;
  type: 'note';
  noteId: string;
};

export type FolderNode = {
  id: string;
  name: string;
  type: 'folder';
  children: Array<FolderNode | FileNode>;
};

export type TreeNode = FolderNode | FileNode;

export interface Note {
  id: string;
  userId: string | null;
  projectId: string | null;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  folderTree?: FolderNode;
}

export interface LibraryItem {
  id: string;
  projectId: string;
  name: string;
  mimeType: string;
  storagePath: string;
  size: number;
  isGlobal: boolean;
  processingStatus: string;
  uploadedAt: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string
  noteId: string
  userId: string
  projectId: string
  term: string
  definition: string
  usingNoteContent: boolean
  needsUpdate: boolean
  createdAt: string
  updatedAt: string
  libraryItems?: LibraryItem[]
}

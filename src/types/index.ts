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

// Lightweight note interface for UI selection lists (no content field)
export interface NoteSummary {
  id: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
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

export interface MultipleChoiceQuestion {
  id: string;
  multipleChoiceSetId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultipleChoiceSet {
  id: string;
  userId: string | null;
  projectId: string | null;
  noteId: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  multipleChoiceQuestions?: MultipleChoiceQuestion[];
}

export interface FreeResponseQuestion {
  id: string;
  freeResponseSetId: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreeResponseSet {
  id: string;
  userId: string | null;
  projectId: string | null;
  noteId: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  freeResponses?: FreeResponseQuestion[];
}

// API Payload Types
export interface CreateNotePayload {
  projectId: string;
  name: string;
  folderPath?: string[];
}

export interface CreateFolderPayload {
  projectId: string;
  name: string;
  folderPath?: string[];
}

export interface UpdateNotePayload extends Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface UpdateStudyOptionsPayload {
  flashcard?: 'queued' | 'completed' | 'failed' | null;
  blurtItOut?: 'queued' | 'completed' | 'failed' | null;
  multipleChoice?: 'queued' | 'completed' | 'failed' | null;
  fillInTheBlank?: 'queued' | 'completed' | 'failed' | null;
  matching?: 'queued' | 'completed' | 'failed' | null;
  shortAnswer?: 'queued' | 'completed' | 'failed' | null;
  essay?: 'queued' | 'completed' | 'failed' | null;
}

export interface CreateMultipleChoiceSetPayload {
  noteId: string;
  name: string;
  selectedLibraryItems?: string[];
  includeNoteContent: boolean;
}

export interface UpdateMultipleChoiceSetPayload {
  name?: string;
}

export interface CreateFreeResponseSetPayload {
  noteId: string;
  name: string;
  selectedLibraryItems?: string[];
  includeNoteContent: boolean;
}

export interface UpdateFreeResponseSetPayload {
  name?: string;
}

export interface CreateFlashcardsPayload {
  noteId: string;
  selectedLibraryItems?: string[];
  includeNoteContent: boolean;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
}

// SSE (Server-Sent Events) Types
export interface SSEEvent {
  type: string;
  data: any;
  timestamp: string;
  channel: string;
}

export interface SSEConnectionOptions {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onReconnecting?: () => void;
  onFlashcardStatus?: (data: any) => void;
  onMultipleChoiceStatus?: (data: any) => void;
  onStudyOptionsUpdate?: (data: any) => void;
  onNoteUpdate?: (data: any) => void;
  onError?: (error: Event) => void;
}

export interface UseOptimizedSSEReturn {
  isConnected: boolean;
  error: Error | null;
  connectionCount: number;
  lastEvent: SSEEvent | null;
  connect: () => void;
  disconnect: () => void;
  retry: () => void;
}

// UI Component Types
export type RightBarView = 'todos' | 'note';

export interface DateTimePickerState {
  isOpen: boolean;
  onConfirm?: (value: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export interface ViewState {
  activeNoteId: string | null;
  rightBarView: RightBarView;
  isFlashcardModalOpen: boolean;
  dateTimePickerState: DateTimePickerState;
  showNote: (noteId: string) => void;
  hideNote: () => void;
  setRightBarView: (view: RightBarView) => void;
  openFlashcardModal: () => void;
  closeFlashcardModal: () => void;
  openDateTimePicker: (options: Omit<DateTimePickerState, 'isOpen'>) => void;
  closeDateTimePicker: () => void;
}

// Multiple Choice Question Parsing Types
export interface ParsedChoice {
  letter: string;
  text: string;
}

export interface ParsedQuestion {
  id: string;
  question: string;
  choices: ParsedChoice[];
  correctAnswer: string;
  explanation: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

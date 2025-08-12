export interface StudySet {
  id: string
  userId: string
  projectId: string
  name: string
  type: 'flashcard' | 'multiple_choice'
  createdAt: string
  updatedAt: string
}

export interface FlashcardSet extends StudySet {
  type: 'flashcard'
  flashcards: Flashcard[]
  libraryItems: LibraryItem[]
  notes: Note[]
}

export interface MultipleChoiceSet extends StudySet {
  type: 'multiple_choice'
  questions: MultipleChoiceQuestion[]
  libraryItems: LibraryItem[]
  notes: Note[]
}

export interface Flashcard {
  id: string
  term: string
  definition: string
  needsUpdate: boolean
  createdAt: string
  updatedAt: string
}

export interface MultipleChoiceQuestion {
  id: string
  question: string
  answer: string
  createdAt: string
  updatedAt: string
}

export interface LibraryItem {
  id: string
  name: string
  type: string
  url?: string
}

export interface Note {
  id: string
  name: string
  content: string
}

export interface CreateStudySetRequest {
  name: string
  type: 'flashcard' | 'multiple_choice'
  projectId: string
  selectedNotes: string[]
  selectedLibraryItems: string[]
}

export interface StudySetProgress {
  id: string
  studySetId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  errorMessage?: string
}
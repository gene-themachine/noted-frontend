import { create } from 'zustand';

type RightBarView = 'todos' | 'note';

interface ViewState {
  activeNoteId: string | null;
  rightBarView: RightBarView;
  isFlashcardModalOpen: boolean;
  showNote: (noteId: string) => void;
  hideNote: () => void;
  setRightBarView: (view: RightBarView) => void;
  openFlashcardModal: () => void;
  closeFlashcardModal: () => void;
}

const useViewStore = create<ViewState>()((set) => ({
  activeNoteId: null,
  rightBarView: 'todos',
  isFlashcardModalOpen: false,
  showNote: (noteId) => set({ activeNoteId: noteId, rightBarView: 'note' }),
  hideNote: () => set({ activeNoteId: null, rightBarView: 'todos' }),
  setRightBarView: (view) => set({ rightBarView: view }),
  openFlashcardModal: () => set({ isFlashcardModalOpen: true }),
  closeFlashcardModal: () => set({ isFlashcardModalOpen: false }),
}));

export default useViewStore; 
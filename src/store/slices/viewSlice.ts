import { create } from 'zustand';
import { RightBarView, ViewState } from '../../types';

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
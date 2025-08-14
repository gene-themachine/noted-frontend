import { create } from 'zustand';
import { RightBarView, ViewState } from '../../types';

const useViewStore = create<ViewState>()((set) => ({
  activeNoteId: null,
  rightBarView: 'todos',
  isFlashcardModalOpen: false,
  dateTimePickerState: {
    isOpen: false,
    onConfirm: undefined,
    initialValue: undefined,
    placeholder: undefined,
  },
  showNote: (noteId) => set({ activeNoteId: noteId, rightBarView: 'note' }),
  hideNote: () => set({ activeNoteId: null, rightBarView: 'todos' }),
  setRightBarView: (view) => set({ rightBarView: view }),
  openFlashcardModal: () => set({ isFlashcardModalOpen: true }),
  closeFlashcardModal: () => set({ isFlashcardModalOpen: false }),
  openDateTimePicker: (options) => set({ 
    dateTimePickerState: { 
      isOpen: true, 
      ...options 
    } 
  }),
  closeDateTimePicker: () => set({ 
    dateTimePickerState: { 
      isOpen: false, 
      onConfirm: undefined,
      initialValue: undefined,
      placeholder: undefined,
    } 
  }),
}));

export default useViewStore; 
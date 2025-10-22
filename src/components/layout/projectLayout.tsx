import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectController from './projectController';
import RightBar from './rightBar';
import AddItemModal from '@/components/modals/AddItemModal';
import ContextModal from '@/components/modals/contextModal';
import { useCreateFolder, useCreateNote, useUpdateStudyOptions, useNote } from '../../hooks/note';
import { useProject } from '../../hooks/project';
import { useProjectLibraryItems, useAddLibraryItemToNote, useRemoveLibraryItemFromNote } from '../../hooks/library';
import { useCreateFlashcards } from '../../hooks/flashcard';
import useViewStore from '../../store/slices/viewSlice';
import AddLibraryItemModal from '@/components/modals/AddLibraryItemModal';
import DateTimePickerModal from '@/components/modals/DateTimePickerModal';

const ProjectLayout = () => {
  const { projectId, noteId } = useParams<{ projectId: string; noteId?: string }>();
  const navigate = useNavigate();
  const [showController, setShowController] = useState(false); // Mobile only
  const [showRightBar, setShowRightBar] = useState(false); // Mobile only
  const [isControllerCollapsed, setIsControllerCollapsed] = useState(true); // Desktop only - default collapsed
  const [isRightBarCollapsed, setIsRightBarCollapsed] = useState(true); // Desktop only - default collapsed
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  
  const { activeNoteId, isFlashcardModalOpen, closeFlashcardModal, showNote, hideNote } = useViewStore();

  useEffect(() => {
    if (noteId) {
      showNote(noteId);
    } else {
      hideNote();
    }
  }, [noteId, showNote, hideNote]);

  const { data: project } = useProject(projectId!);
  const { data: projectLibraryItems } = useProjectLibraryItems(projectId!);
  const { data: note } = useNote(activeNoteId!);
  const createFolderMutation = useCreateFolder();
  const createNoteMutation = useCreateNote();
  const updateStudyOptionsMutation = useUpdateStudyOptions();
  const createFlashcardsMutation = useCreateFlashcards();
  const addLibraryItemMutation = useAddLibraryItemToNote();
  const removeLibraryItemMutation = useRemoveLibraryItemFromNote();

  // Set page title to project name
  useEffect(() => {
    if (project?.name) {
      document.title = project.name;
    }
  }, [project?.name]);


  const handleAddItem = (type: 'folder' | 'note', name: string) => {
    if (!project) return;
    
    if (type === 'folder') {
      createFolderMutation.mutate({
        projectId: project.id,
        name,
        folderPath: [],
      });
    } else {
      createNoteMutation.mutate({
        projectId: project.id,
        name,
        folderPath: [],
      });
    }
    setIsAddItemModalOpen(false);
  };

  const handleAddLibraryItem = (libraryItemId: string) => {
    if (!activeNoteId) return;
    addLibraryItemMutation.mutate({ noteId: activeNoteId, libraryItemId });
  };

  const handleRemoveLibraryItem = (libraryItemId: string) => {
    if (!activeNoteId) return;
    removeLibraryItemMutation.mutate({ noteId: activeNoteId, libraryItemId });
  };


  const handleFlashcardModalConfirm = useCallback((selectedItems: string[], includeNoteContent: boolean) => {
    if (!activeNoteId) return;

    // First enable flashcards in study options
    updateStudyOptionsMutation.mutate({
      noteId: activeNoteId,
      payload: { flashcard: 'queued' },
    });

    // Create flashcards using the API
    createFlashcardsMutation.mutate({
      noteId: activeNoteId,
      selectedLibraryItems: selectedItems,
      includeNoteContent: includeNoteContent,
    });
    
    closeFlashcardModal();
  }, [activeNoteId, updateStudyOptionsMutation, createFlashcardsMutation, closeFlashcardModal]);

  return (
    <div className="flex-grow relative overflow-hidden [--sidebar-width:14rem] lg:[--sidebar-width:16rem] xl:[--sidebar-width:18rem]">
      {/* Mobile Hamburger Buttons */}
      <div className="lg:hidden fixed top-4 left-4 right-4 z-modal flex justify-between pointer-events-none">
        <button
          onClick={() => setShowController(!showController)}
          className="bg-surface rounded-2xl shadow-floating p-4 pointer-events-auto hover:bg-surface-hover"
          aria-label="Toggle project controller"
        >
          <div className="w-5 h-5 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-foreground-secondary rounded-full"></div>
            <div className="w-full h-0.5 bg-foreground-secondary rounded-full"></div>
            <div className="w-full h-0.5 bg-foreground-secondary rounded-full"></div>
          </div>
        </button>
        <button
          onClick={() => setShowRightBar(!showRightBar)}
          className="bg-surface rounded-2xl shadow-floating p-4 pointer-events-auto hover:bg-surface-hover"
          aria-label="Toggle todos sidebar"
        >
          <div className="w-5 h-5 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-foreground-secondary rounded-full"></div>
            <div className="w-full h-0.5 bg-foreground-secondary rounded-full"></div>
            <div className="w-full h-0.5 bg-foreground-secondary rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Mobile Overlay */}
      {(showController || showRightBar) && (
        <div 
          className="lg:hidden fixed inset-0 bg-background-overlay z-dropdown"
          onClick={() => {
            setShowController(false);
            setShowRightBar(false);
          }}
        />
      )}

      {/* --- Desktop Layout --- */}
      <div className="h-full lg:relative">

        {/* Controller Sidebar */}
        <aside className={`
          lg:fixed lg:top-32 lg:left-8 lg:w-[var(--sidebar-width)] lg:h-[26rem] lg:z-10
          transition-transform duration-500 ease-in-out
          ${isControllerCollapsed ? 'lg:-translate-x-[calc(100%+4rem)]' : 'lg:translate-x-0'}
          ${showController 
            ? 'fixed top-0 left-0 w-sidebar h-full z-modal translate-x-0' 
            : 'fixed top-0 left-0 w-sidebar h-full z-modal -translate-x-full'
          }
        `}>
          <div className="bg-surface rounded-2xl shadow-floating h-full overflow-hidden">
            <div className="p-4 lg:p-6 h-full">
              <ProjectController 
                projectId={projectId} 
                onMobileClose={() => setShowController(false)}
                isCollapsed={isControllerCollapsed}
                onAddItem={() => setIsAddItemModalOpen(true)}
              />
            </div>
          </div>
        </aside>
        
        {/* Controller Toggle Button */}
        <button
          onClick={() => setIsControllerCollapsed(!isControllerCollapsed)}
          className={`
            hidden lg:flex fixed top-1/2 -translate-y-1/2 z-20 items-center justify-center
            bg-surface hover:bg-surface-hover shadow-lg rounded-full
            w-12 h-12 transition-all duration-500 ease-in-out group
            focus:outline-none focus:ring-0
            ${isControllerCollapsed 
                ? 'left-4' 
                : 'left-[calc(2rem+var(--sidebar-width)-1.5rem)]'
            }
          `}
          aria-label={isControllerCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isControllerCollapsed 
              ? <ChevronRight className="w-5 h-5 text-foreground-secondary group-hover:text-foreground" /> 
              : <ChevronLeft className="w-5 h-5 text-foreground-secondary group-hover:text-foreground" />
          }
        </button>

        {/* Main Content */}
        <main className="w-full h-full lg:py-8 lg:px-24">
          <div className="w-full h-full max-w-content mx-auto">
            <div className="h-full mt-20 lg:mt-0">
              <Outlet context={{ openLibraryModal: () => setIsContextModalOpen(true) }} />
            </div>
          </div>
        </main>

        {/* RightBar */}
        <aside className={`
          lg:fixed lg:right-8 lg:top-32 lg:w-[var(--sidebar-width)] lg:h-[28rem] lg:z-10
          transition-transform duration-500 ease-in-out
          ${isRightBarCollapsed ? 'lg:translate-x-[calc(100%+4rem)]' : 'lg:translate-x-0'}
        `}>
          <div className="bg-surface rounded-2xl shadow-floating h-full overflow-hidden">
             <div className="p-4 lg:p-6 h-full">
              <RightBar />
            </div>
          </div>
        </aside>

        {/* RightBar Toggle Button */}
        <button
          onClick={() => setIsRightBarCollapsed(!isRightBarCollapsed)}
          className={`
            hidden lg:flex fixed top-1/2 -translate-y-1/2 z-20 items-center justify-center
            bg-surface hover:bg-surface-hover shadow-lg rounded-full
            w-12 h-12 transition-all duration-500 ease-in-out group
            focus:outline-none focus:ring-0
            ${isRightBarCollapsed 
                ? 'right-4' 
                : 'right-[calc(2rem+var(--sidebar-width)-1.5rem)]'
            }
          `}
          aria-label={isRightBarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isRightBarCollapsed 
              ? <ChevronLeft className="w-5 h-5 text-foreground-secondary group-hover:text-foreground" /> 
              : <ChevronRight className="w-5 h-5 text-foreground-secondary group-hover:text-foreground" />
          }
        </button>

      </div>

      {/* Add Item Modal - Rendered at top level to avoid container clipping */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        theme="light"
      />

      {/* Context Modal for Flashcards - Rendered at project level for all note screens */}
      <ContextModal
        isOpen={isFlashcardModalOpen}
        onClose={closeFlashcardModal}
        onConfirm={handleFlashcardModalConfirm}
        noteContent={note?.content || ''}
        noteName={note?.name || ''}
        projectLibraryItems={projectLibraryItems || []}
        noteLibraryItems={note?.libraryItems || []}
      />

      <AddLibraryItemModal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        projectLibrary={projectLibraryItems || []}
        noteLibrary={note?.libraryItems || []}
        onAddItem={handleAddLibraryItem}
        onRemoveItem={handleRemoveLibraryItem}
      />

      {/* DateTimePicker Modal - Global modal for date/time selection */}
      <DateTimePickerModal />

    </div>
  );
};

export default ProjectLayout;
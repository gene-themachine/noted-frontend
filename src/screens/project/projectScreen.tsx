import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import QuickActionModal from '@/components/modals/QuickActionModal';
import AddItemModal from '@/components/modals/AddItemModal';
import AddLibraryItemModal from '@/components/modals/AddLibraryItemModal';
import NoteSelectionModal from '@/components/modals/NoteSelectionModal';
import { useProject } from '@/hooks/project';
import { useProjectLibraryItems } from '@/hooks/library';
import { useCreateNote, useCreateFolder } from '@/hooks/note';
import { useProjectNotes } from '@/hooks/studySets';
import { NoteSummary } from '@/types';
import { getPresignedUrl, uploadFileToS3, notifyBackendOfUpload } from '@/api/library';
import { useQueryClient } from '@tanstack/react-query';

const ProjectScreen = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isNoteSelectionOpen, setIsNoteSelectionOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [noteSelectionResolve, setNoteSelectionResolve] = useState<((note: NoteSummary | null) => void) | null>(null);
  const [librarySelectionResolve, setLibrarySelectionResolve] = useState<((items: { id: string; name: string }[]) => void) | null>(null);

  const { data: project } = useProject(projectId!);
  const { data: projectLibraryItems } = useProjectLibraryItems(projectId!);
  const { data: projectNotes } = useProjectNotes(projectId!);
  const createNoteMutation = useCreateNote();
  const createFolderMutation = useCreateFolder();
  const queryClient = useQueryClient();

  const handleFileUpload = async (file: File) => {
    if (!projectId) return;
    
    try {
      // Get presigned URL
      const { presignedUrl, key } = await getPresignedUrl(file);
      
      // Upload to S3
      await uploadFileToS3(presignedUrl, file);
      
      // Notify backend
      await notifyBackendOfUpload({
        key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        projectId,
      });
      
      // Refresh library data
      queryClient.invalidateQueries({ queryKey: ['projectLibrary', projectId] });
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleQuickActionSelectNote = (): Promise<NoteSummary | null> => {
    return new Promise((resolve) => {
      setNoteSelectionResolve(() => resolve);
      setIsNoteSelectionOpen(true);
    });
  };

  const handleQuickActionFromLibrary = (): Promise<{ id: string; name: string }[]> => {
    return new Promise((resolve) => {
      setLibrarySelectionResolve(() => resolve);
      setIsLibraryModalOpen(true);
    });
  };

  const handleNoteSelection = (noteId: string) => {
    const selectedNote = projectNotes?.find(note => note.id === noteId) || null;
    if (noteSelectionResolve) {
      noteSelectionResolve(selectedNote);
      setNoteSelectionResolve(null);
    }
    setIsNoteSelectionOpen(false);
  };

  const handleLibrarySelection = (items: { id: string; name: string }[]) => {
    if (librarySelectionResolve) {
      librarySelectionResolve(items);
      setLibrarySelectionResolve(null);
    }
    setIsLibraryModalOpen(false);
  };

  const handleMultiSourceContinue = async (sources: any) => {
    // Handle file uploads
    for (const file of sources.files) {
      await handleFileUpload(file);
    }

    // Handle pasted texts - create notes
    for (const pastedText of sources.pastedTexts) {
      if (project) {
        // For now, just create the note - content would need to be set via updateNote
        createNoteMutation.mutate({
          projectId: project.id,
          name: pastedText.name,
          folderPath: [],
        });
      }
    }

    // Navigate to first selected note if any
    if (sources.notes.length > 0) {
      navigate(`/project/${projectId}/note/${sources.notes[0].id}`);
    } else if (sources.libraryItems.length > 0) {
      // Could navigate to library or show some feedback
      console.log('Selected library items:', sources.libraryItems);
    }
  };

  const handleQuickActionPasteText = () => {
    if (project) {
      const timestamp = new Date().toLocaleString();
      createNoteMutation.mutate({
        projectId: project.id,
        name: `Pasted Content - ${timestamp}`,
        folderPath: [],
      });
    }
  };

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

  return (
    <div className="relative w-full flex-grow">
      {/* Center Blue Circle - Fixed positioning for true centering */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => setIsComingSoonModalOpen(true)}
          className="w-56 h-56 rounded-full bg-primary-blue hover:bg-hover-blue shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-blue focus:ring-offset-4"
          aria-label="New feature"
        >
        </button>
      </div>

      <QuickActionModal
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
        onContinue={handleMultiSourceContinue}
        onSelectNote={handleQuickActionSelectNote}
        onSelectLibraryItems={handleQuickActionFromLibrary}
        theme="light"
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        theme="light"
      />

      <AddLibraryItemModal
        isOpen={isLibraryModalOpen}
        onClose={() => {
          if (librarySelectionResolve) {
            librarySelectionResolve([]);
            setLibrarySelectionResolve(null);
          }
          setIsLibraryModalOpen(false);
        }}
        projectLibrary={projectLibraryItems || []}
        noteLibrary={[]}
        onAddItem={(libraryItemId: string) => {
          // Find the item and add to selection
          const item = projectLibraryItems?.find(lib => lib.id === libraryItemId);
          if (item && librarySelectionResolve) {
            librarySelectionResolve([{ id: item.id, name: item.name }]);
            setLibrarySelectionResolve(null);
            setIsLibraryModalOpen(false);
          }
        }}
        onRemoveItem={() => {}}
      />

      <NoteSelectionModal
        isOpen={isNoteSelectionOpen}
        onClose={() => {
          if (noteSelectionResolve) {
            noteSelectionResolve(null);
            setNoteSelectionResolve(null);
          }
          setIsNoteSelectionOpen(false);
        }}
        onSelectNote={handleNoteSelection}
        notes={projectNotes || []}
        theme="light"
      />

      {/* Coming Soon Modal */}
      {isComingSoonModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              New Feature Coming Soon!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We're working on something exciting. Stay tuned!
            </p>
            <button
              onClick={() => setIsComingSoonModalOpen(false)}
              className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-hover-blue transition-all duration-200 font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectScreen;

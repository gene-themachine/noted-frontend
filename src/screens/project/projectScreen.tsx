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
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow flex items-center justify-center">
        <button
          onClick={() => setIsQuickActionModalOpen(true)}
          className="flex items-center justify-center w-48 h-48 bg-primary-blue hover:bg-primary-blue-hover rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="Start quick action"
        >
          <Plus className="w-16 h-16 text-white" />
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
    </div>
  );
};

export default ProjectScreen;

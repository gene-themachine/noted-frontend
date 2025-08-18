import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Play, RefreshCw, ArrowLeft, Paperclip, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useFlashcardSet, useUpdateFlashcardSet, useDeleteStudySet } from '../../hooks/studySets';
import { Button } from '../../components/ui/button';
import { StudySetDropdownMenu } from '../../components/ui/StudySetDropdownMenu';
import { RenameStudySetModal } from '../../components/ui/RenameStudySetModal';
import { DeleteConfirmationModal } from '../../components/ui/DeleteConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardSetScreen() {
  const { projectId, setId } = useParams<{ projectId: string; setId: string }>();
  const navigate = useNavigate();
  
  const { data: flashcardSet, isLoading, error } = useFlashcardSet(setId || null);
  const updateFlashcardSetMutation = useUpdateFlashcardSet();
  const deleteStudySetMutation = useDeleteStudySet();
  
  const [showAttachedFiles, setShowAttachedFiles] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const flashcards = useMemo(() => flashcardSet?.flashcards || [], [flashcardSet]);
  
  // Get unique library items from the flashcard set
  const flashcardLibraryItems = useMemo(() => {
    return flashcardSet?.libraryItems || [];
  }, [flashcardSet]);

  const handleBack = () => {
    navigate(`/project/${projectId}/tools`);
  };

  const handleRename = async (newName: string) => {
    if (!setId) return;
    
    try {
      await updateFlashcardSetMutation.mutateAsync({
        setId,
        payload: { name: newName }
      });
      setShowRenameModal(false);
    } catch (error) {
      console.error('Failed to rename flashcard set:', error);
    }
  };

  const handleDelete = async () => {
    if (!setId) return;
    
    try {
      await deleteStudySetMutation.mutateAsync({
        setId,
        type: 'flashcard'
      });
      setShowDeleteModal(false);
      navigate(`/project/${projectId}/tools`);
    } catch (error) {
      console.error('Failed to delete flashcard set:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex items-center gap-3 text-foreground-secondary">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading flashcard set...
        </div>
      </div>
    );
  }

  if (error || !flashcardSet) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-foreground-secondary">
        <div className="text-lg mb-4">Error loading flashcard set</div>
        <div className="text-sm mb-6">The flashcard set you're looking for doesn't exist or may have been deleted.</div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>
      </div>
    );
  }

  const handleStartStudy = () => {
    navigate(`/project/${projectId}/study-sets/flashcards/${setId}/study`);
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Flashcards</h1>
            <p className="text-sm text-gray-500">
              {flashcardSet.name}
            </p>
          </div>
          
          <StudySetDropdownMenu
            onRename={() => setShowRenameModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {flashcardLibraryItems.length > 0 && (
        <div className="mb-8">
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
            onClick={() => setShowAttachedFiles(!showAttachedFiles)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowAttachedFiles(!showAttachedFiles);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Flashcard Assets
              </h3>
              <span className="text-xs font-normal text-gray-500">
                ({flashcardLibraryItems.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {showAttachedFiles ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {showAttachedFiles && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                  {flashcardLibraryItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 p-2 rounded-lg text-xs text-gray-700 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {flashcards.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-6">
            No flashcards yet
          </h2>
          <p className="text-sm text-foreground-secondary mb-6">
            This flashcard set is still being generated or is empty.
          </p>
        </div>
      ) : (
        /* Flashcards List */
        <div className="flex-1">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-sm text-foreground-secondary">
              {flashcards.length} flashcards
            </div>
            <Button
              onClick={handleStartStudy}
              className="flex items-center gap-2 bg-primary-blue hover:bg-blue-600 text-white"
            >
              <Play className="w-4 h-4" />
              Learn
            </Button>
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {flashcards.map((flashcard: any, index: number) => (
              <div
                key={flashcard.id}
                className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-primary-blue hover:shadow-sm transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/project/${projectId}/study-sets/flashcards/${setId}/study/${flashcard.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                  {flashcard.needsUpdate && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  )}
                </div>
                <h3 className="font-medium text-foreground text-sm leading-relaxed line-clamp-3">
                  {flashcard.term}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <RenameStudySetModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onRename={handleRename}
        currentName={flashcardSet?.name || ''}
        setType="flashcard"
        isLoading={updateFlashcardSetMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Flashcard Set"
        message={`Are you sure you want to delete "${flashcardSet?.name}"? This action cannot be undone and will permanently remove all ${flashcards.length} flashcards.`}
        isLoading={deleteStudySetMutation.isPending}
      />
    </div>
  );
}
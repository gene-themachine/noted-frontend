import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Play, RefreshCw, Paperclip, ChevronDown, ChevronUp, FileText, ArrowLeft, Target } from 'lucide-react';
import { useMultipleChoiceSet, useUpdateMultipleChoiceSet, useDeleteStudySet } from '../../hooks/studySets';
import { Button } from '../../components/ui/button';
import { StudySetDropdownMenu } from '../../components/ui/StudySetDropdownMenu';
import { RenameStudySetModal } from '../../components/ui/RenameStudySetModal';
import { DeleteConfirmationModal } from '../../components/ui/DeleteConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function MultipleChoiceSetScreen() {
  const { projectId, setId } = useParams<{ projectId: string; setId: string }>();
  const navigate = useNavigate();
  
  const { data: multipleChoiceSet, isLoading, error } = useMultipleChoiceSet(setId || null);
  const updateMultipleChoiceSetMutation = useUpdateMultipleChoiceSet();
  const deleteStudySetMutation = useDeleteStudySet();
  
  const [showAttachedFiles, setShowAttachedFiles] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const questions = useMemo(() => multipleChoiceSet?.questions || [], [multipleChoiceSet]);
  
  // Get unique library items from the multiple choice set
  const multipleChoiceLibraryItems = useMemo(() => {
    return multipleChoiceSet?.libraryItems || [];
  }, [multipleChoiceSet]);

  const handleBack = () => {
    navigate(`/project/${projectId}/tools`);
  };

  const handleRename = async (newName: string) => {
    if (!setId) return;
    
    try {
      await updateMultipleChoiceSetMutation.mutateAsync({
        setId,
        payload: { name: newName }
      });
      setShowRenameModal(false);
    } catch (error) {
      console.error('Failed to rename multiple choice set:', error);
    }
  };

  const handleDelete = async () => {
    if (!setId) return;
    
    try {
      await deleteStudySetMutation.mutateAsync({
        setId,
        type: 'multiple_choice'
      });
      setShowDeleteModal(false);
      navigate(`/project/${projectId}/tools`);
    } catch (error) {
      console.error('Failed to delete multiple choice set:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex items-center gap-3 text-foreground-secondary">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading multiple choice set...
        </div>
      </div>
    );
  }

  if (error || !multipleChoiceSet) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-foreground-secondary">
        <div className="text-lg mb-4">Error loading multiple choice set</div>
        <div className="text-sm mb-6">The multiple choice set you're looking for doesn't exist or may have been deleted.</div>
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

  const handleStartQuiz = () => {
    navigate(`/project/${projectId}/study-sets/multiple-choice/${setId}/study`);
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
            <h1 className="text-xl font-semibold text-foreground mb-2">Multiple Choice Quiz</h1>
            <p className="text-sm text-gray-500">
              {multipleChoiceSet.name}
            </p>
          </div>
          
          <StudySetDropdownMenu
            onRename={() => setShowRenameModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {multipleChoiceLibraryItems.length > 0 && (
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
                Quiz Assets
              </h3>
              <span className="text-xs font-normal text-gray-500">
                ({multipleChoiceLibraryItems.length})
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
                  {multipleChoiceLibraryItems.map((item) => (
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
      
      {questions.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
            <Target className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-6">
            No questions yet
          </h2>
          <p className="text-sm text-foreground-secondary mb-6">
            Questions are being generated for this set. Please check back soon.
          </p>
        </div>
      ) : (
        /* Questions List */
        <div className="flex-1">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-sm text-foreground-secondary">
              {questions.length} questions
            </div>
            <Button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 bg-primary-orange hover:bg-orange-600 text-white"
            >
              <Play className="w-4 h-4" />
              Start Quiz
            </Button>
          </div>

          {/* Questions Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {questions.map((question: any, index: number) => (
              <div
                key={question.id}
                className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-primary-orange hover:shadow-sm transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/project/${projectId}/study-sets/multiple-choice/${setId}/study/${question.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                  <Target className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="font-medium text-foreground text-sm leading-relaxed line-clamp-3">
                  {question.question}
                </h3>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center mt-12">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-orange transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <RenameStudySetModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onRename={handleRename}
        currentName={multipleChoiceSet?.name || ''}
        setType="multiple_choice"
        isLoading={updateMultipleChoiceSetMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Multiple Choice Set"
        message={`Are you sure you want to delete "${multipleChoiceSet?.name}"? This action cannot be undone and will permanently remove all ${questions.length} questions.`}
        isLoading={deleteStudySetMutation.isPending}
      />
    </div>
  );
}
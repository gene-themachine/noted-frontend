import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Hash,
  Play,
  Star
} from 'lucide-react'
import { FlashcardSet, MultipleChoiceSet } from '../../types/studySets'
import CreateFlashcardSetModal from '../../components/modals/CreateFlashcardSetModal'
import CreateMultipleChoiceSetModal from '../../components/modals/CreateMultipleChoiceSetModal'
import { 
  useProjectFlashcardSets, 
  useProjectMultipleChoiceSets,
  useCreateFlashcardSet,
  useCreateMultipleChoiceSet,
  useProjectNotes,
} from '../../hooks/studySets'
import { useProjectLibraryItems } from '../../hooks/library'

export default function ToolsMainScreen() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [showFlashcards, setShowFlashcards] = useState(true)
  const [showMultipleChoice, setShowMultipleChoice] = useState(true)
  const [isCreateFlashcardModalOpen, setIsCreateFlashcardModalOpen] = useState(false)
  const [isCreateMultipleChoiceModalOpen, setIsCreateMultipleChoiceModalOpen] = useState(false)

  // Load core data immediately
  const { data: flashcardSets = [], isLoading: flashcardsLoading } = useProjectFlashcardSets(projectId || null)
  const { data: multipleChoiceSets = [], isLoading: multipleChoiceLoading } = useProjectMultipleChoiceSets(projectId || null)
  
  // Lazy load modal data only when needed
  const { data: projectNotes = [], isLoading: notesLoading } = useProjectNotes(
    (isCreateFlashcardModalOpen || isCreateMultipleChoiceModalOpen) ? projectId || null : null
  )
  const { data: projectLibraryItems = [], isLoading: libraryLoading } = useProjectLibraryItems(
    (isCreateFlashcardModalOpen || isCreateMultipleChoiceModalOpen) ? projectId || '' : ''
  )
  
  const createFlashcardSet = useCreateFlashcardSet()
  const createMultipleChoiceSet = useCreateMultipleChoiceSet()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleStudySetClick = (set: FlashcardSet | MultipleChoiceSet) => {
    if (set.type === 'flashcard') {
      navigate(`/project/${projectId}/study-sets/flashcards/${set.id}`)
    } else {
      navigate(`/project/${projectId}/study-sets/multiple-choice/${set.id}`)
    }
  }

  const handleCreateFlashcardSet = (data: {
    name: string
    selectedNotes: string[]
    selectedLibraryItems: string[]
  }) => {
    if (!projectId) return
    createFlashcardSet.mutate({
      ...data,
      projectId,
      type: 'flashcard'
    })
    setIsCreateFlashcardModalOpen(false)
  }

  const handleCreateMultipleChoiceSet = (data: {
    name: string
    selectedNotes: string[]
    selectedLibraryItems: string[]
  }) => {
    if (!projectId) return
    createMultipleChoiceSet.mutate({
      ...data,
      projectId,
      type: 'multiple_choice'
    })
    setIsCreateMultipleChoiceModalOpen(false)
  }

  const handleViewStarredFlashcards = () => {
    navigate(`/project/${projectId}/starred-flashcards`)
  }

  // Render loading states for individual sections
  const renderFlashcardSection = () => {
    if (flashcardsLoading) {
      return (
        <div className="flex items-center justify-center py-12 bg-surface rounded-2xl border border-border-light">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue"></div>
          <span className="ml-3 text-foreground-secondary">Loading flashcard sets...</span>
        </div>
      )
    }

    return (
      <AnimatePresence>
        {showFlashcards && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {flashcardSets.length === 0 ? (
              <div className="text-center py-12 bg-surface rounded-2xl border border-border-light">
                <BookOpen className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-secondary mb-4">No flashcard sets yet</p>
                <button
                  onClick={() => setIsCreateFlashcardModalOpen(true)}
                  className="text-primary-blue hover:text-hover-blue transition-colors text-sm font-medium"
                >
                  Create your first set
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {flashcardSets.map((set: FlashcardSet, index: number) => (
                  <motion.div
                    key={set.id}
                    onClick={() => handleStudySetClick(set)}
                    className="group bg-surface border-2 border-border-light rounded-2xl p-6 hover:border-primary-blue hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04),0_0_0_1px_rgba(59,130,246,0.1)] hover:bg-gradient-to-br hover:from-surface hover:to-blue-50/30 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <BookOpen className="w-5 h-5 text-primary-blue flex-shrink-0" />
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            // Navigate to flashcard set to show individual flashcards for starring
                            navigate(`/project/${projectId}/study-sets/flashcards/${set.id}`)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-yellow-500/10 hover:scale-110 rounded-lg"
                        >
                          <Star className="w-4 h-4 text-foreground-muted hover:text-yellow-500 transition-colors duration-200" />
                        </button>
                        <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-primary-blue/10 hover:scale-110 rounded-lg">
                          <Play className="w-4 h-4 text-foreground-muted hover:text-primary-blue transition-colors duration-200" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {set.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs text-foreground-tertiary">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <span>{set.flashcards?.length || 0} cards</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(set.createdAt)}</span>
                      </div>
                    </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  const renderMultipleChoiceSection = () => {
    if (multipleChoiceLoading) {
      return (
        <div className="flex items-center justify-center py-12 bg-surface rounded-2xl border border-border-light">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-orange"></div>
          <span className="ml-3 text-foreground-secondary">Loading multiple choice sets...</span>
        </div>
      )
    }

    return (
      <AnimatePresence>
        {showMultipleChoice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {multipleChoiceSets.length === 0 ? (
              <div className="text-center py-12 bg-surface rounded-2xl border border-border-light">
                <Brain className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-secondary mb-4">No multiple choice sets yet</p>
                <button
                  onClick={() => setIsCreateMultipleChoiceModalOpen(true)}
                  className="text-primary-orange hover:text-hover-orange transition-colors text-sm font-medium"
                >
                  Create your first set
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {multipleChoiceSets.map((set: MultipleChoiceSet, index: number) => (
                  <motion.div
                    key={set.id}
                    onClick={() => handleStudySetClick(set)}
                    className="group bg-surface border-2 border-border-light rounded-2xl p-6 hover:border-primary-orange hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,120,0,0.1)] hover:bg-gradient-to-br hover:from-surface hover:to-orange-50/30 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Brain className="w-5 h-5 text-primary-orange flex-shrink-0" />
                      <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-primary-orange/10 hover:scale-110 rounded-lg">
                        <Play className="w-4 h-4 text-foreground-muted hover:text-primary-orange transition-colors duration-200" />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {set.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs text-foreground-tertiary">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <span>{set.questions?.length || 0} questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(set.createdAt)}</span>
                      </div>
                    </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }


  return (
    <div className="flex flex-col h-full font-helvetica">
      <div className="p-6 sm:p-8 lg:p-12 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">Study Tools</h1>
          <p className="text-foreground-secondary text-lg leading-relaxed max-w-2xl">Create and manage flashcards and quizzes from your notes and library items</p>
        </div>

        {/* Flashcards Section */}
        <div className="mb-20 px-2">
          <div className="flex items-center justify-between mb-10">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => setShowFlashcards(!showFlashcards)}
            >
              <BookOpen className="w-6 h-6 text-primary-blue" />
              <h2 className="text-xl font-semibold text-foreground">Flashcards</h2>
              <span className="text-sm text-foreground-tertiary">({flashcardSets.length})</span>
              {showFlashcards ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleViewStarredFlashcards}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-foreground-inverse rounded-xl hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Starred</span>
              </button>
              <button
                onClick={() => setIsCreateFlashcardModalOpen(true)}
                disabled={createFlashcardSet.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary-blue text-foreground-inverse rounded-xl hover:bg-hover-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-blue"
              >
                {createFlashcardSet.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {createFlashcardSet.isPending ? 'Creating...' : 'Create Set'}
                </span>
              </button>
            </div>
          </div>

          {renderFlashcardSection()}
        </div>

        {/* Multiple Choice Section */}
        <div className="mb-20 px-2">
          <div className="flex items-center justify-between mb-10">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => setShowMultipleChoice(!showMultipleChoice)}
            >
              <Brain className="w-6 h-6 text-primary-orange" />
              <h2 className="text-xl font-semibold text-foreground">Multiple Choice</h2>
              <span className="text-sm text-foreground-tertiary">({multipleChoiceSets.length})</span>
              {showMultipleChoice ? (
                <ChevronUp className="w-5 h-5 text-foreground-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground-muted" />
              )}
            </div>
            <button
              onClick={() => setIsCreateMultipleChoiceModalOpen(true)}
              disabled={createMultipleChoiceSet.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary-orange text-foreground-inverse rounded-xl hover:bg-hover-orange transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-orange"
            >
              {createMultipleChoiceSet.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {createMultipleChoiceSet.isPending ? 'Creating...' : 'Create Set'}
              </span>
            </button>
          </div>

          {renderMultipleChoiceSection()}
        </div>

      </div>

      {/* Create Study Set Modals */}
      <CreateFlashcardSetModal
        isOpen={isCreateFlashcardModalOpen}
        onClose={() => setIsCreateFlashcardModalOpen(false)}
        onConfirm={handleCreateFlashcardSet}
        projectNotes={projectNotes}
        projectLibraryItems={projectLibraryItems}
        isLoadingNotes={notesLoading}
        isLoadingLibrary={libraryLoading}
      />

      <CreateMultipleChoiceSetModal
        isOpen={isCreateMultipleChoiceModalOpen}
        onClose={() => setIsCreateMultipleChoiceModalOpen(false)}
        onConfirm={handleCreateMultipleChoiceSet}
        projectNotes={projectNotes}
        projectLibraryItems={projectLibraryItems}
        isLoadingNotes={notesLoading}
        isLoadingLibrary={libraryLoading}
      />
    </div>
  )
}
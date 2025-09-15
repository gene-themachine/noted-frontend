import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  MessageSquareText,
  Plus, 
  Calendar,
  Hash,
  Star,
  Zap
} from 'lucide-react'
import { FlashcardSet, MultipleChoiceSet, FreeResponseSet } from '../../types/studySets'
import CreateFlashcardSetModal from '../../components/modals/CreateFlashcardSetModal'
import CreateMultipleChoiceSetModal from '../../components/modals/CreateMultipleChoiceSetModal'
import CreateFreeResponseSetModal from '../../components/modals/CreateFreeResponseSetModal'
import { 
  useProjectFlashcardSets, 
  useProjectMultipleChoiceSets,
  useProjectFreeResponseSets,
  useCreateFlashcardSet,
  useCreateMultipleChoiceSet,
  useCreateFreeResponseSet,
  useProjectNotes,
} from '../../hooks/studySets'
import { useProjectLibraryItems } from '../../hooks/library'

type TabType = 'flashcards' | 'multiple-choice' | 'free-response'

export default function ToolsMainScreen() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('flashcards')
  const [isCreateFlashcardModalOpen, setIsCreateFlashcardModalOpen] = useState(false)
  const [isCreateMultipleChoiceModalOpen, setIsCreateMultipleChoiceModalOpen] = useState(false)
  const [isCreateFreeResponseModalOpen, setIsCreateFreeResponseModalOpen] = useState(false)

  // Load core data immediately
  const { data: flashcardSets = [], isLoading: flashcardsLoading } = useProjectFlashcardSets(projectId || null)
  const { data: multipleChoiceSets = [], isLoading: multipleChoiceLoading } = useProjectMultipleChoiceSets(projectId || null)
  const { data: freeResponseSets = [], isLoading: freeResponseLoading } = useProjectFreeResponseSets(projectId || null)
  
  // Lazy load modal data only when needed
  const { data: projectNotes = [], isLoading: notesLoading } = useProjectNotes(
    (isCreateFlashcardModalOpen || isCreateMultipleChoiceModalOpen || isCreateFreeResponseModalOpen) ? projectId || null : null
  )
  const { data: projectLibraryItems = [], isLoading: libraryLoading } = useProjectLibraryItems(
    (isCreateFlashcardModalOpen || isCreateMultipleChoiceModalOpen || isCreateFreeResponseModalOpen) ? projectId || '' : ''
  )
  
  const createFlashcardSet = useCreateFlashcardSet()
  const createMultipleChoiceSet = useCreateMultipleChoiceSet()
  const createFreeResponseSet = useCreateFreeResponseSet()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleStudySetClick = (set: FlashcardSet | MultipleChoiceSet | FreeResponseSet) => {
    if (set.type === 'flashcard') {
      navigate(`/project/${projectId}/study-sets/flashcards/${set.id}`)
    } else if (set.type === 'multiple_choice') {
      navigate(`/project/${projectId}/study-sets/multiple-choice/${set.id}`)
    } else {
      navigate(`/project/${projectId}/study-sets/free-response/${set.id}`)
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

  const handleCreateFreeResponseSet = (data: {
    name: string
    selectedNotes: string[]
    selectedLibraryItems: string[]
  }) => {
    if (!projectId) return
    createFreeResponseSet.mutate({
      ...data,
      projectId,
      type: 'free_response'
    })
    setIsCreateFreeResponseModalOpen(false)
  }

  const handleViewStarredFlashcards = () => {
    navigate(`/project/${projectId}/starred-flashcards`)
  }

  const handleViewStarredMultipleChoice = () => {
    navigate(`/project/${projectId}/starred-multiple-choice-questions`)
  }

  const StudySetCard = ({ set, type }: { set: FlashcardSet | MultipleChoiceSet | FreeResponseSet, type: 'flashcard' | 'multiple-choice' | 'free-response' }) => {
    const isFlashcard = type === 'flashcard'
    const isMultipleChoice = type === 'multiple-choice'
    const isFreeResponse = type === 'free-response'
    
    const icon = isFlashcard ? BookOpen : isMultipleChoice ? Brain : MessageSquareText
    const color = isFlashcard ? 'primary-blue' : isMultipleChoice ? 'primary-orange' : 'green-600'
    
    let count = 0
    let countLabel = ''
    
    if (isFlashcard) {
      count = (set as FlashcardSet).flashcards?.length || 0
      countLabel = 'cards'
    } else if (isMultipleChoice) {
      count = (set as MultipleChoiceSet).questions?.length || 0
      countLabel = 'questions'
    } else {
      count = (set as FreeResponseSet).freeResponses?.length || (set as FreeResponseSet).questions?.length || 0
      countLabel = 'questions'
    }
    
    return (
      <motion.div
        onClick={() => handleStudySetClick(set)}
        className="group bg-surface border border-border-light rounded-xl p-4 hover:border-border-strong hover:shadow-card-hover transition-all duration-200 cursor-pointer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between mb-3">
          {React.createElement(icon, { className: `w-5 h-5 text-${color} flex-shrink-0` })}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${color} opacity-60`} />
            <span className="text-xs text-foreground-tertiary font-medium uppercase tracking-wide">
              {type === 'flashcard' ? 'Cards' : type === 'multiple-choice' ? 'Quiz' : 'Practice'}
            </span>
          </div>
        </div>
        
        <h3 className="font-semibold text-foreground mb-3 leading-tight line-clamp-2">
          {set.name}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-foreground-tertiary">
          <div className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            <span>{count} {countLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(set.createdAt)}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  const EmptyState = ({ type }: { type: 'flashcard' | 'multiple-choice' | 'free-response' }) => {
    const isFlashcard = type === 'flashcard'
    const isMultipleChoice = type === 'multiple-choice'
    const isFreeResponse = type === 'free-response'
    
    const icon = isFlashcard ? BookOpen : isMultipleChoice ? Brain : MessageSquareText
    const color = isFlashcard ? 'primary-blue' : isMultipleChoice ? 'primary-orange' : 'green-600'
    
    const title = isFlashcard ? 'No flashcard sets yet' : isMultipleChoice ? 'No quiz sets yet' : 'No practice sets yet'
    const description = isFlashcard 
      ? 'Create flashcards from your notes to help memorize key concepts'
      : isMultipleChoice 
        ? 'Generate multiple choice questions to test your understanding'
        : 'Create free response questions to practice detailed explanations'
    
    return (
      <div className="text-center py-16 px-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-${color}/10 rounded-full mb-4`}>
          {React.createElement(icon, { className: `w-8 h-8 text-${color}` })}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-foreground-secondary mb-6 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
        <button
          onClick={() => 
            isFlashcard 
              ? setIsCreateFlashcardModalOpen(true) 
              : isMultipleChoice 
                ? setIsCreateMultipleChoiceModalOpen(true) 
                : setIsCreateFreeResponseModalOpen(true)
          }
          className={`inline-flex items-center gap-2 px-4 py-2.5 bg-${color} text-white rounded-lg hover:bg-${color}/90 transition-colors duration-200 font-medium`}
        >
          <Plus className="w-4 h-4" />
          Create your first set
        </button>
      </div>
    )
  }

  const LoadingState = ({ type }: { type: 'flashcard' | 'multiple-choice' | 'free-response' }) => {
    const isFlashcard = type === 'flashcard'
    const isMultipleChoice = type === 'multiple-choice'
    const color = isFlashcard ? 'primary-blue' : isMultipleChoice ? 'primary-orange' : 'green-600'
    
    const label = isFlashcard ? 'flashcard' : isMultipleChoice ? 'quiz' : 'practice'
    
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className={`animate-spin rounded-full h-8 w-8 border-2 border-${color}/20 border-t-${color}`}></div>
        <span className="mt-3 text-sm text-foreground-secondary">
          Loading {label} sets...
        </span>
      </div>
    )
  }

  const renderContent = () => {
    if (activeTab === 'flashcards') {
      if (flashcardsLoading) return <LoadingState type="flashcard" />
      
      if (flashcardSets.length === 0) {
        return <EmptyState type="flashcard" />
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {flashcardSets.map((set: FlashcardSet) => (
            <StudySetCard key={set.id} set={set} type="flashcard" />
          ))}
        </div>
      )
    } else if (activeTab === 'multiple-choice') {
      if (multipleChoiceLoading) return <LoadingState type="multiple-choice" />
      
      if (multipleChoiceSets.length === 0) {
        return <EmptyState type="multiple-choice" />
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {multipleChoiceSets.map((set: MultipleChoiceSet) => (
            <StudySetCard key={set.id} set={set} type="multiple-choice" />
          ))}
        </div>
      )
    } else {
      if (freeResponseLoading) return <LoadingState type="free-response" />
      
      if (freeResponseSets.length === 0) {
        return <EmptyState type="free-response" />
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {freeResponseSets.map((set: FreeResponseSet) => (
            <StudySetCard key={set.id} set={set} type="free-response" />
          ))}
        </div>
      )
    }
  }

  const getActiveTabData = () => {
    if (activeTab === 'flashcards') {
      return { sets: flashcardSets, loading: flashcardsLoading }
    } else if (activeTab === 'multiple-choice') {
      return { sets: multipleChoiceSets, loading: multipleChoiceLoading }
    } else {
      return { sets: freeResponseSets, loading: freeResponseLoading }
    }
  }

  const activeData = getActiveTabData()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Study Tools</h1>
              <p className="text-foreground-secondary leading-relaxed">
                Create and manage flashcards, quizzes, and free response practice from your notes and library items
              </p>
            </div>
            
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center bg-surface-hover p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'flashcards'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Flashcards</span>
                <span className="bg-primary-blue/10 text-primary-blue px-2 py-0.5 rounded-full text-xs font-medium">
                  {flashcardSets.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('multiple-choice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'multiple-choice'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>Multiple Choice</span>
                <span className="bg-primary-orange/10 text-primary-orange px-2 py-0.5 rounded-full text-xs font-medium">
                  {multipleChoiceSets.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('free-response')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'free-response'
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <MessageSquareText className="w-4 h-4" />
                <span>Free Response</span>
                <span className="bg-green-600/10 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {freeResponseSets.length}
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {activeTab === 'flashcards' && (
                <button
                  onClick={handleViewStarredFlashcards}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-600 rounded-lg hover:bg-yellow-500/20 transition-colors duration-200 text-sm font-medium"
                >
                  <Star className="w-4 h-4" />
                  <span className="hidden sm:inline">Starred</span>
                </button>
              )}
              {activeTab === 'multiple-choice' && (
                <button
                  onClick={handleViewStarredMultipleChoice}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-600 rounded-lg hover:bg-yellow-500/20 transition-colors duration-200 text-sm font-medium"
                >
                  <Star className="w-4 h-4" />
                  <span className="hidden sm:inline">Starred</span>
                </button>
              )}
              
              <button
                onClick={() => 
                  activeTab === 'flashcards' 
                    ? setIsCreateFlashcardModalOpen(true) 
                    : activeTab === 'multiple-choice' 
                      ? setIsCreateMultipleChoiceModalOpen(true) 
                      : setIsCreateFreeResponseModalOpen(true)
                }
                disabled={
                  activeTab === 'flashcards' 
                    ? createFlashcardSet.isPending 
                    : activeTab === 'multiple-choice' 
                      ? createMultipleChoiceSet.isPending 
                      : createFreeResponseSet.isPending
                }
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'flashcards'
                    ? 'bg-primary-blue hover:bg-primary-blue/90'
                    : activeTab === 'multiple-choice'
                      ? 'bg-primary-orange hover:bg-primary-orange/90'
                      : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {(activeTab === 'flashcards' ? createFlashcardSet.isPending : activeTab === 'multiple-choice' ? createMultipleChoiceSet.isPending : createFreeResponseSet.isPending) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Create Set</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
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

      <CreateFreeResponseSetModal
        isOpen={isCreateFreeResponseModalOpen}
        onClose={() => setIsCreateFreeResponseModalOpen(false)}
        onConfirm={handleCreateFreeResponseSet}
        projectNotes={projectNotes}
        projectLibraryItems={projectLibraryItems}
        isLoadingNotes={notesLoading}
        isLoadingLibrary={libraryLoading}
      />
    </div>
  )
}

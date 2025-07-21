import React, { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useViewStore from '../../store/slices/viewSlice'
import StudyOption from './components/StudyOption'
import {
  useStudyOptions,
  useUpdateStudyOptions,
  useAvailableStudyOptions,
} from '../../hooks/note'

export default function NoteRightBar() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { activeNoteId, openFlashcardModal } = useViewStore()
  const { data: activeStudyOptions, isLoading: isLoadingActiveStudyOptions } =
    useStudyOptions(activeNoteId!)
  const { data: availableStudyOptions, isLoading: isLoadingAvailableStudyOptions } =
    useAvailableStudyOptions()
  const updateStudyOptionsMutation = useUpdateStudyOptions()

  const handleOptionClick = useCallback((optionKey: string) => {
    if (!activeNoteId || !activeStudyOptions) return

    const currentValue = activeStudyOptions[optionKey as keyof typeof activeStudyOptions]

    // Special handling for study options that have dedicated screens
    if (optionKey === 'flashcard') {
      if (!currentValue) {
        // If flashcards is currently false, open the context modal instead of toggling
        openFlashcardModal()
        return
      } else {
        // If flashcards is already true, navigate to flashcard screen
        navigate(`/project/${projectId}/note/${activeNoteId}/flashcards`)
        return
      }
    }

    // Handle other study options that have screens
    if (currentValue) {
      // If the option is already enabled, navigate to its screen
      switch (optionKey) {
        case 'freeResponse':
          navigate(`/project/${projectId}/note/${activeNoteId}/free-response`)
          return
        case 'multipleChoice':
          navigate(`/project/${projectId}/note/${activeNoteId}/multiple-choice`)
          return
        default:
          // For other options without dedicated screens, just toggle
          break
      }
    }

    // For toggling (enabling/disabling) options
    updateStudyOptionsMutation.mutate({
      noteId: activeNoteId,
      payload: { [optionKey]: !currentValue },
    })
  }, [activeNoteId, activeStudyOptions, updateStudyOptionsMutation, openFlashcardModal, navigate, projectId])

  const isLoading = isLoadingActiveStudyOptions || isLoadingAvailableStudyOptions

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-3">
        {availableStudyOptions &&
          Object.entries(availableStudyOptions).map(([key, value]) => {
            const isEnabled = activeStudyOptions
              ? activeStudyOptions[key as keyof typeof activeStudyOptions]
              : false
            return (
              <StudyOption
                key={key}
                text={value as string}
                onClick={() => handleOptionClick(key)}
                disabled={!activeNoteId}
                isEnabled={isEnabled}
              />
            )
          })}
        {!activeNoteId && (
          <div className="text-center text-foreground-tertiary text-sm mt-4">
            Select a note to enable study options.
          </div>
        )}
        {isLoading && activeNoteId && (
          <div className="text-center text-foreground-tertiary text-sm mt-4">Loading...</div>
        )}
      </div>
    </div>
  )
}
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
      if (!currentValue || currentValue === 'null') {
        // If flashcards is not started, open the context modal to queue it
        openFlashcardModal()
        return
      } else if (currentValue === 'queued') {
        // If flashcards is queued, navigate to flashcard screen
        navigate(`/project/${projectId}/note/${activeNoteId}/flashcards`)
        return
      } else if (currentValue === 'completed' || currentValue === 'failed') {
        // If completed or failed, reset to queued for review/retry
        updateStudyOptionsMutation.mutate({
          noteId: activeNoteId,
          payload: { [optionKey]: 'queued' },
        })
        return
      }
    }

    // Handle other study options that have screens
    if (currentValue === 'queued') {
      // If the option is queued, navigate to its screen
      switch (optionKey) {
        case 'freeResponse':
          navigate(`/project/${projectId}/note/${activeNoteId}/free-response`)
          return
        case 'multipleChoice':
          navigate(`/project/${projectId}/note/${activeNoteId}/multiple-choice`)
          return
        default:
          // For other options without dedicated screens, mark as completed
          updateStudyOptionsMutation.mutate({
            noteId: activeNoteId,
            payload: { [optionKey]: 'completed' },
          })
          return
      }
    } else if (currentValue === 'completed' || currentValue === 'failed') {
      // If completed or failed, reset to queued for review/retry
      updateStudyOptionsMutation.mutate({
        noteId: activeNoteId,
        payload: { [optionKey]: 'queued' },
      })
      return
    }

    // For starting new study options (null -> queued)
    updateStudyOptionsMutation.mutate({
      noteId: activeNoteId,
      payload: { [optionKey]: 'queued' },
    })
  }, [activeNoteId, activeStudyOptions, updateStudyOptionsMutation, openFlashcardModal, navigate, projectId])

  const isLoading = isLoadingActiveStudyOptions || isLoadingAvailableStudyOptions

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-3">
        {availableStudyOptions &&
          Object.entries(availableStudyOptions).map(([key, value]) => {
            const currentValue = activeStudyOptions
              ? activeStudyOptions[key as keyof typeof activeStudyOptions]
              : null
            const status = currentValue || 'null'
            return (
              <StudyOption
                key={key}
                text={value as string}
                onClick={() => handleOptionClick(key)}
                disabled={!activeNoteId}
                isEnabled={status !== 'null'}
                status={status as 'null' | 'queued' | 'completed' | 'failed'}
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
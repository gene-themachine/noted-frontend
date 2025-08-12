import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, CheckCircle, FileText, PlusCircle } from 'lucide-react'
import { LibraryItem } from '../../types/studySets'
import { NoteSummary } from '../../types'

interface CreateFlashcardSetModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: {
    name: string
    selectedNotes: string[]
    selectedLibraryItems: string[]
  }) => void
  projectNotes: NoteSummary[]
  projectLibraryItems: LibraryItem[]
  isLoadingNotes?: boolean
  isLoadingLibrary?: boolean
}

export default function CreateFlashcardSetModal({
  isOpen,
  onClose,
  onConfirm,
  projectNotes,
  projectLibraryItems,
  isLoadingNotes = false,
  isLoadingLibrary = false,
}: CreateFlashcardSetModalProps) {
  const [name, setName] = useState('')
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<string[]>([])

  const handleNoteToggle = (noteId: string) => {
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    )
  }

  const handleLibraryItemToggle = (itemId: string) => {
    setSelectedLibraryItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleConfirm = () => {
    if (!name.trim()) return

    onConfirm({
      name: name.trim(),
      selectedNotes,
      selectedLibraryItems,
    })
    
    // Reset form
    setName('')
    setSelectedNotes([])
    setSelectedLibraryItems([])
    onClose()
  }

  const handleClose = () => {
    // Reset form
    setName('')
    setSelectedNotes([])
    setSelectedLibraryItems([])
    onClose()
  }

  const hasSelections = selectedNotes.length > 0 || selectedLibraryItems.length > 0
  const canSubmit = name.trim() && hasSelections

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background-overlay flex items-center justify-center z-modal"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="bg-surface rounded-2xl p-6 max-w-lg w-full mx-4 shadow-floating-lg flex flex-col font-helvetica max-h-[80vh]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create Flashcard Set</h3>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-background-secondary">
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            <div className="mb-6">
              <label htmlFor="set-name" className="block text-sm font-medium text-foreground-secondary mb-2">
                Set Name
              </label>
              <input
                id="set-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter flashcard set name..."
                className="w-full px-4 py-2 border border-border-light rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent text-foreground"
                autoFocus
              />
            </div>

            <p className="text-sm text-foreground-secondary mb-6">
              Choose content to include in your flashcard set:
            </p>

            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Notes Section */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Notes</h4>
                {isLoadingNotes ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-foreground-secondary">Loading notes...</p>
                  </div>
                ) : projectNotes && projectNotes.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {projectNotes.map((note) => {
                      const isSelected = selectedNotes.includes(note.id)
                      
                      return (
                        <div
                          key={note.id}
                          onClick={() => handleNoteToggle(note.id)}
                          className={`p-3 rounded-xl border border-border-light cursor-pointer transition-colors duration-200 ${
                            isSelected
                              ? 'bg-blue-50 border-primary-blue'
                              : 'bg-background hover:bg-background-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-foreground-secondary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{note.name}</p>
                              </div>
                            </div>
                            {isSelected ? (
                              <CheckCircle className="w-4 h-4 text-primary-blue" />
                            ) : (
                              <PlusCircle className="w-4 h-4 text-foreground-secondary" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-foreground-secondary">No notes available in this project.</p>
                  </div>
                )}
              </div>

              {/* Library Items Section */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Library Items</h4>
                {isLoadingLibrary ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-foreground-secondary">Loading library items...</p>
                  </div>
                ) : projectLibraryItems && projectLibraryItems.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {projectLibraryItems.map((item) => {
                      const isSelected = selectedLibraryItems.includes(item.id)
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleLibraryItemToggle(item.id)}
                          className={`p-3 rounded-xl border border-border-light cursor-pointer transition-colors duration-200 ${
                            isSelected
                              ? 'bg-blue-50 border-primary-blue'
                              : 'bg-background hover:bg-background-secondary'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-foreground-secondary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                <p className="text-xs text-foreground-tertiary">{item.type}</p>
                              </div>
                            </div>
                            {isSelected ? (
                              <CheckCircle className="w-4 h-4 text-primary-blue" />
                            ) : (
                              <PlusCircle className="w-4 h-4 text-foreground-secondary" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-foreground-secondary">No library items available in this project.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-foreground-secondary hover:text-foreground transition-colors duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canSubmit}
                className={`px-5 py-2 font-semibold rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  canSubmit
                    ? 'bg-primary-blue text-foreground-inverse hover:bg-hover-blue focus:ring-primary-blue'
                    : 'bg-border text-foreground-muted cursor-not-allowed'
                }`}
              >
                Create Flashcard Set
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
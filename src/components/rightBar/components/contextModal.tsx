import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, CheckCircle, FileText, PlusCircle, MinusCircle } from 'lucide-react'
import { LibraryItem } from '../../../types'

interface ContextModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedItems: string[], includeNoteContent: boolean) => void
  noteContent: string
  noteName: string
  projectLibraryItems: LibraryItem[]
  noteLibraryItems: LibraryItem[]
}

export default function ContextModal({
  isOpen,
  onClose,
  onConfirm,
  noteContent,
  noteName,
  projectLibraryItems,
  noteLibraryItems,
}: ContextModalProps) {
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<string[]>([])
  const [includeNoteContent, setIncludeNoteContent] = useState(false)

  const handleLibraryItemToggle = (itemId: string) => {
    setSelectedLibraryItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedLibraryItems, includeNoteContent)
    onClose()
    // Reset selections
    setSelectedLibraryItems([])
    setIncludeNoteContent(false)
  }

  const handleClose = () => {
    onClose()
    // Reset selections
    setSelectedLibraryItems([])
    setIncludeNoteContent(false)
  }

  const hasSelections = selectedLibraryItems.length > 0 || includeNoteContent

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
              <h3 className="text-lg font-semibold text-foreground">Create Flashcards</h3>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-background-alt">
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            <p className="text-sm text-foreground-secondary mb-6">
              Choose what content to include in your flashcards:
            </p>

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Note Content Option - Always show, even if content is empty */}
              <div
                onClick={() => setIncludeNoteContent(!includeNoteContent)}
                className={`p-4 rounded-xl border border-border-light cursor-pointer transition-colors duration-200 ${
                  includeNoteContent
                    ? 'bg-white border-primary-blue'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-foreground-secondary" />
                    <div>
                      <h4 className="font-medium text-foreground">Note Content</h4>
                      <p className="text-sm text-foreground-secondary">
                        {noteContent 
                          ? `Content from "${noteName}"`
                          : `Note "${noteName}" (currently empty)`
                        }
                      </p>
                    </div>
                  </div>
                  {includeNoteContent && (
                    <CheckCircle className="w-5 h-5 text-primary-blue" />
                  )}
                </div>
              </div>

              {/* Library Items */}
              {projectLibraryItems && projectLibraryItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Project Library Items</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {projectLibraryItems.map((item) => {
                      const isSelected = selectedLibraryItems.includes(item.id)
                      const isAttachedToNote = noteLibraryItems?.some(noteItem => noteItem.id === item.id)
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleLibraryItemToggle(item.id)}
                          className={`p-3 rounded-lg border border-border-light cursor-pointer transition-colors duration-200 ${
                            isSelected
                              ? 'bg-white border-primary-blue'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-foreground-secondary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                {isAttachedToNote && (
                                  <p className="text-xs text-primary-blue">Attached to note</p>
                                )}
                              </div>
                            </div>
                            {isSelected ? (
                              <MinusCircle className="w-4 h-4 text-primary-blue" />
                            ) : (
                              <PlusCircle className="w-4 h-4 text-foreground-secondary" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
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
                disabled={!hasSelections}
                className={`px-5 py-2 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  hasSelections
                    ? 'bg-primary-blue text-foreground-inverse hover:bg-primary-blue/90 focus:ring-primary-blue'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Flashcards
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, CheckCircle, FileText, PlusCircle, MessageSquareText } from 'lucide-react'
import { LibraryItem } from '../../types/studySets'
import { NoteSummary } from '../../types'

interface CreateFreeResponseSetModalProps {
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

export default function CreateFreeResponseSetModal({
  isOpen,
  onClose,
  onConfirm,
  projectNotes,
  projectLibraryItems,
  isLoadingNotes = false,
  isLoadingLibrary = false,
}: CreateFreeResponseSetModalProps) {
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
    if (name.trim() && (selectedNotes.length > 0 || selectedLibraryItems.length > 0)) {
      onConfirm({
        name: name.trim(),
        selectedNotes,
        selectedLibraryItems,
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setName('')
    setSelectedNotes([])
    setSelectedLibraryItems([])
    onClose()
  }

  const isValid = name.trim().length > 0 && (selectedNotes.length > 0 || selectedLibraryItems.length > 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquareText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create Free Response Set</h2>
                  <p className="text-sm text-gray-500">Generate practice questions for detailed explanations</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Practice Set Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a name for your free response set..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    autoFocus
                  />
                </div>

                {/* Content Selection */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Select content sources * (Choose at least one)
                  </p>
                  
                  {/* Notes Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-700">Project Notes</h3>
                      <span className="text-xs text-gray-500">({projectNotes.length})</span>
                    </div>

                    {isLoadingNotes ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-200 border-t-green-600"></div>
                        <span className="ml-3 text-sm text-gray-500">Loading notes...</span>
                      </div>
                    ) : projectNotes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No notes found in this project</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {projectNotes.map((note) => (
                          <div
                            key={note.id}
                            onClick={() => handleNoteToggle(note.id)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedNotes.includes(note.id)
                                ? 'bg-green-50 border border-green-200'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              selectedNotes.includes(note.id)
                                ? 'bg-green-600 border-green-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedNotes.includes(note.id) && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className={`text-sm flex-1 ${
                              selectedNotes.includes(note.id) ? 'text-green-900' : 'text-gray-700'
                            }`}>
                              {note.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Library Items Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-700">Library Items</h3>
                      <span className="text-xs text-gray-500">({projectLibraryItems.length})</span>
                    </div>

                    {isLoadingLibrary ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-200 border-t-green-600"></div>
                        <span className="ml-3 text-sm text-gray-500">Loading library items...</span>
                      </div>
                    ) : projectLibraryItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No library items found in this project</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {projectLibraryItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleLibraryItemToggle(item.id)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                              selectedLibraryItems.includes(item.id)
                                ? 'bg-green-50 border border-green-200'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              selectedLibraryItems.includes(item.id)
                                ? 'bg-green-600 border-green-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedLibraryItems.includes(item.id) && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className={`text-sm flex-1 ${
                              selectedLibraryItems.includes(item.id) ? 'text-green-900' : 'text-gray-700'
                            }`}>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selection Summary */}
                {(selectedNotes.length > 0 || selectedLibraryItems.length > 0) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Selected Content</h4>
                    <div className="space-y-1 text-sm text-green-800">
                      {selectedNotes.length > 0 && (
                        <p>• {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''}</p>
                      )}
                      {selectedLibraryItems.length > 0 && (
                        <p>• {selectedLibraryItems.length} library item{selectedLibraryItems.length !== 1 ? 's' : ''}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                AI will generate practice questions from your selected content
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!isValid}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isValid
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Practice Set
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
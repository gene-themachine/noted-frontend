import React from 'react'

interface StudyOptionProps {
  text: string
  onClick: () => void
  disabled: boolean
  isEnabled: boolean
  status: 'null' | 'queued' | 'completed' | 'failed'
}

export default function StudyOption({ text, onClick, disabled, isEnabled, status }: StudyOptionProps) {
  const baseClasses =
    'w-full text-left transition-colors duration-200 p-4 rounded-xl border relative group'

  const getActionText = () => {
    switch (status) {
      case 'completed':
        return 'Click to review'
      case 'queued':
        return 'Click to study'
      case 'failed':
        return 'Click to study' // Treat failed same as queued - both need attention
      default:
        return 'Click to start'
    }
  }

  // Create specific classes based on state to avoid hover conflicts
  const getStateClasses = () => {
    if (disabled) {
      return 'opacity-50 cursor-not-allowed bg-gray-100 border-border-light'
    }
    
    switch (status) {
      case 'completed':
        return 'bg-white border-gray-300 hover:bg-gray-50 cursor-pointer focus:outline-none active:bg-gray-100'
      case 'queued':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer focus:outline-none active:bg-blue-150'
      case 'failed':
        // Treat failed as "work in progress" - show blue to indicate it needs attention
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer focus:outline-none active:bg-blue-150'
      default: // null
        return 'bg-gray-100 border-border-light hover:bg-gray-200 cursor-pointer focus:outline-none active:bg-gray-300'
    }
  }

  const getTextColor = () => {
    if (disabled) return 'text-foreground-secondary'
    
    switch (status) {
      case 'completed':
        return 'text-gray-800' // Dark text on white background
      case 'queued':
        return 'text-blue-800'
      case 'failed':
        return 'text-blue-800' // Same as queued - both are "work in progress"
      default:
        return 'text-foreground-secondary'
    }
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'completed':
        return <div className="absolute top-2 right-2 w-2 h-2 bg-gray-600 rounded-full"></div>
      case 'queued':
        return <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      case 'failed':
        return <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      default:
        return null
    }
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`${baseClasses} ${getStateClasses()}`}
      title={!disabled ? getActionText() : undefined}
    >
      {getStatusIndicator()}
      <p className={`text-sm font-medium ${getTextColor()}`}>
        {text}
      </p>
      {!disabled && (
        <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
          <span className="text-xs text-current">
            {getActionText()}
          </span>
        </div>
      )}
    </div>
  )
} 
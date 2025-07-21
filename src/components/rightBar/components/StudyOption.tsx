import React from 'react'

interface StudyOptionProps {
  text: string
  onClick: () => void
  disabled: boolean
  isEnabled: boolean
}

export default function StudyOption({ text, onClick, disabled, isEnabled }: StudyOptionProps) {
  const baseClasses =
    'w-full text-left transition-colors duration-200 p-4 rounded-xl border border-border-light'

  // Create specific classes based on state to avoid hover conflicts
  const getStateClasses = () => {
    if (disabled) {
      return 'opacity-50 cursor-not-allowed bg-gray-100'
    }
    
    if (isEnabled) {
      return 'bg-white hover:bg-gray-50 cursor-pointer focus:outline-none active:bg-gray-100'
    } else {
      return 'bg-gray-100 hover:bg-gray-200 cursor-pointer focus:outline-none active:bg-gray-300'
    }
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`${baseClasses} ${getStateClasses()}`}
    >
      <p className={`text-sm font-medium ${isEnabled ? 'text-black' : 'text-foreground-secondary'}`}>
        {text}
      </p>
    </div>
  )
} 
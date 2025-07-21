import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ToggleSwitchProps {
  isOn: boolean
  onToggle: () => void
  disabled?: boolean
}

export default function ToggleSwitch({ isOn, onToggle, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={isOn ? 'Disable integration' : 'Enable integration'}
      className={clsx(
        'w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary-blue',
        {
          'bg-primary-blue justify-end': isOn,
          'bg-gray-600 justify-start': !isOn,
          'opacity-50 cursor-not-allowed': disabled,
        }
      )}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full"
        layout
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.8 }}
      />
    </button>
  )
} 
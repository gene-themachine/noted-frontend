import React from 'react';
import clsx from 'clsx';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  theme?: 'light' | 'dark';
}

const defaultColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FECA57', // Yellow
  '#FF6899', // Pink
  '#9B59B6', // Purple
  '#3498DB', // Light Blue
  '#2ECC71', // Emerald
  '#E74C3C', // Dark Red
  '#F39C12', // Orange
  '#1ABC9C', // Turquoise
];

export default function ColorPicker({ value, onChange, theme = 'dark' }: ColorPickerProps) {
  const isLightTheme = theme === 'light';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        {defaultColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={clsx(
              'relative w-12 h-12 rounded-xl transition-all duration-200 group',
              'hover:scale-110 hover:shadow-lg',
              value === color && 'scale-110 shadow-lg'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {value === color && (
              <div className="absolute inset-0 rounded-xl ring-2 ring-white ring-offset-2 ring-offset-transparent" />
            )}
            <div className={clsx(
              'absolute inset-0 rounded-xl',
              'bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'
            )} />
          </button>
        ))}
      </div>
      
      <div className="relative">
        <label 
          htmlFor="custom-color"
          className={clsx(
            'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
            'border-2 border-dashed',
            isLightTheme 
              ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50' 
              : 'border-white/20 hover:border-white/30 hover:bg-white/5'
          )}
        >
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-lg shadow-inner"
              style={{ backgroundColor: value || '#4ECDC4' }}
            />
            <Palette className={clsx(
              'absolute bottom-0 right-0 w-4 h-4 translate-x-1 translate-y-1',
              isLightTheme ? 'text-gray-600' : 'text-white/60'
            )} />
          </div>
          <span className={clsx(
            'text-sm font-medium',
            isLightTheme ? 'text-gray-600' : 'text-white/60'
          )}>
            Custom color
          </span>
          <input
            id="custom-color"
            type="color"
            value={value || '#4ECDC4'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
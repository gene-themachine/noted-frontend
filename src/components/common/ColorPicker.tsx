import React from 'react';
import clsx from 'clsx';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  theme?: 'light' | 'dark';
  disabled?: boolean;
}

const defaultColors = [
  '#0078b9', // Primary Blue
  '#ff7800', // Primary Orange
  '#16a34a', // Green
  '#b94400', // Rust Orange/Brown
  '#1e40af', // Navy Blue
];

export default function ColorPicker({ value, onChange, theme = 'dark', disabled = false }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {defaultColors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => !disabled && onChange(color)}
          disabled={disabled}
          className={clsx(
            'relative w-12 h-12 rounded-xl transition-all duration-200 group',
            !disabled && 'hover:scale-110 hover:shadow-lg cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed',
            value === color && 'scale-110 shadow-lg'
          )}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        >
          {value === color && (
            <div className="absolute inset-0 rounded-xl ring-2 ring-white ring-offset-2 ring-offset-transparent" />
          )}
          {!disabled && (
            <div className={clsx(
              'absolute inset-0 rounded-xl',
              'bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'
            )} />
          )}
        </button>
      ))}
    </div>
  );
}
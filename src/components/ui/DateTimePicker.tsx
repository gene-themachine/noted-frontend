import React from 'react';
import { Calendar } from 'lucide-react';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import useViewStore from '../../store/slices/viewSlice';

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showTime?: boolean;
}

export default function DateTimePicker({ 
  value, 
  onChange, 
  placeholder = 'Select date and time',
  className = '',
  showTime = true
}: DateTimePickerProps) {
  const { openDateTimePicker } = useViewStore();

  const handleClick = () => {
    openDateTimePicker({
      onConfirm: onChange,
      initialValue: value,
      placeholder,
    });
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    
    const selectedDate = new Date(value);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = addDays(today, 1);
    const dateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    let dateStr = '';
    if (isSameDay(dateOnly, today)) {
      dateStr = 'Today';
    } else if (isSameDay(dateOnly, tomorrow)) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = format(selectedDate, 'MMM d');
    }
    
    if (showTime) {
      return `${dateStr} at ${format(selectedDate, 'h:mm a')}`;
    }
    return dateStr;
  };

  return (
    <div className={`${className}`}>
      <div
        onClick={handleClick}
        className="flex items-center gap-2 px-2 py-1 bg-transparent text-xs text-foreground-secondary cursor-pointer hover:text-foreground transition-colors duration-200"
      >
        <Calendar className="w-3 h-3 text-foreground-tertiary" />
        <span className={formatDisplayValue() ? '' : 'text-foreground-tertiary'}>
          {formatDisplayValue() || placeholder}
        </span>
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
import './DateTimePicker.css';

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function DateTimePicker({ 
  value, 
  onChange, 
  placeholder = 'Select date and time',
  className = ''
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [timeValue, setTimeValue] = useState(
    value ? format(new Date(value), 'HH:mm') : '12:00'
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const [hours, minutes] = timeValue.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      setSelectedDate(date);
      onChange(date.toISOString());
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    
    if (selectedDate) {
      const [hours, minutes] = newTime.split(':');
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      setSelectedDate(newDate);
      onChange(newDate.toISOString());
    }
  };

  const displayValue = selectedDate 
    ? `${format(selectedDate, 'MMM d, yyyy')} at ${format(selectedDate, 'h:mm a')}`
    : '';

  return (
    <div className={`relative date-time-picker ${className}`} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1 bg-transparent text-sm text-foreground-secondary cursor-pointer flex items-center gap-2 hover:text-foreground transition-colors duration-200"
      >
        <Calendar className="w-3 h-3 text-foreground-tertiary" />
        <span className={displayValue ? '' : 'text-foreground-tertiary'}>
          {displayValue || placeholder}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-surface border border-border-light shadow-sm z-50">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            showOutsideDays={false}
            className="p-3"
          />
          
          <div className="border-t border-border-light p-3 flex items-center gap-2">
            <Clock className="w-3 h-3 text-foreground-tertiary" />
            <input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="bg-transparent text-sm text-foreground-secondary focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
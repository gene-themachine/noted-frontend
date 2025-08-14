import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isSameMonth, isToday } from 'date-fns';
import clsx from 'clsx';
import useViewStore from '../../store/slices/viewSlice';

export default function DateTimePickerModal() {
  const { dateTimePickerState, closeDateTimePicker } = useViewStore();
  const { isOpen, onConfirm, initialValue, placeholder } = dateTimePickerState;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialValue ? new Date(initialValue) : undefined
  );
  const [timeValue, setTimeValue] = useState(
    initialValue ? format(new Date(initialValue), 'HH:mm') : '09:00'
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(initialValue ? new Date(initialValue) : undefined);
      setTimeValue(initialValue ? format(new Date(initialValue), 'HH:mm') : '09:00');
      setCurrentMonth(new Date());
      setStep('date');
    }
  }, [isOpen, initialValue]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
  };

  const handleQuickSelect = (date: Date) => {
    const [hours, minutes] = timeValue.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    setSelectedDate(date);
    setStep('time');
  };

  const handleConfirm = () => {
    if (!selectedDate) return;
    
    const [hours, minutes] = timeValue.split(':');
    const finalDate = new Date(selectedDate);
    finalDate.setHours(parseInt(hours), parseInt(minutes));
    
    if (onConfirm) {
      onConfirm(finalDate.toISOString());
    }
    closeDateTimePicker();
  };

  const handleCancel = () => {
    closeDateTimePicker();
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isTodayDate = isToday(day);
        
        days.push(
          <button
            key={day.toString()}
            type="button"
            className={clsx(
              'w-10 h-10 flex items-center justify-center text-sm rounded-md transition-colors duration-200',
              isCurrentMonth 
                ? isSelected 
                  ? 'bg-primary-blue text-white font-medium'
                  : isTodayDate
                    ? 'text-primary-blue font-medium hover:bg-surface-hover'
                    : 'text-foreground-secondary hover:bg-surface-hover'
                : 'text-foreground-muted cursor-not-allowed'
            )}
            onClick={() => isCurrentMonth && handleDateSelect(cloneDay)}
            disabled={!isCurrentMonth}
          >
            {format(day, dateFormat)}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="flex justify-between">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="space-y-4">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 text-foreground-tertiary hover:text-foreground-secondary hover:bg-surface-hover rounded-md transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-medium text-foreground-secondary">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 text-foreground-tertiary hover:text-foreground-secondary hover:bg-surface-hover rounded-md transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Day Headers */}
        <div className="flex justify-between mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="w-10 h-10 flex items-center justify-center text-xs font-medium text-foreground-muted">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="space-y-1">
          {rows}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-surface border border-border-light rounded-2xl p-6 w-full max-w-sm shadow-floating"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {step === 'date' ? 'Select Date' : 'Select Time'}
          </h2>

          {step === 'date' && (
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSelect(new Date())}
                  className="flex-1 px-3 py-2 text-sm text-foreground-secondary hover:bg-surface-hover rounded-md transition-colors duration-200"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect(addDays(new Date(), 1))}
                  className="flex-1 px-3 py-2 text-sm text-foreground-secondary hover:bg-surface-hover rounded-md transition-colors duration-200"
                >
                  Tomorrow
                </button>
              </div>
              
              {/* Calendar */}
              {renderCalendar()}
            </div>
          )}

          {step === 'time' && selectedDate && (
            <div className="space-y-6">
              {/* Selected Date Display */}
              <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg">
                <Calendar className="w-5 h-5 text-primary-blue" />
                <span className="text-foreground font-medium">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>

              {/* Time Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground-secondary">
                  Time
                </label>
                <div className="flex items-center gap-3 p-3 border border-border-light rounded-lg focus-within:border-primary-blue transition-colors duration-200">
                  <Clock className="w-5 h-5 text-foreground-tertiary" />
                  <input
                    type="time"
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="bg-transparent text-foreground focus:outline-none flex-1"
                    autoFocus
                  />
                </div>
              </div>

              {/* Back to Date Button */}
              <button
                type="button"
                onClick={() => setStep('date')}
                className="text-sm text-primary-blue hover:text-primary-blue/80 transition-colors duration-200"
              >
                ← Change date
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-light">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-foreground-tertiary hover:text-foreground-secondary hover:bg-surface-hover rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedDate}
              className="px-4 py-2 text-sm bg-primary-blue text-white hover:bg-primary-blue/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 font-medium"
            >
              {step === 'date' ? 'Next' : 'Confirm'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

const DateInput = ({ 
  value = '', 
  onChange, 
  placeholder = 'Select date...', 
  className = '', 
  label,
  error,
  required = false,
  disabled = false,
  name
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const hiddenInputRef = useRef(null);

  // Format date for display (MM/DD/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
    
    // Format as MM/DD/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Format as YYYY-MM-DD for HTML input
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Parse user input and convert to ISO date
  const parseUserInput = (input) => {
    if (!input) return '';
    
    // Remove any non-numeric characters except slashes
    let cleaned = input.replace(/[^\d\/]/g, '');
    
    // Try to parse various formats
    let date;
    
    if (cleaned.includes('/')) {
      const parts = cleaned.split('/');
      if (parts.length === 3) {
        // MM/DD/YYYY or M/D/YYYY
        const month = parseInt(parts[0]);
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          // Handle 2-digit years by assuming 20xx
          const fullYear = year < 100 ? 2000 + year : year;
          date = new Date(fullYear, month - 1, day);
        }
      }
    } else if (cleaned.length === 8) {
      // MMDDYYYY
      const month = parseInt(cleaned.substr(0, 2));
      const day = parseInt(cleaned.substr(2, 2));
      const year = parseInt(cleaned.substr(4, 4));
      
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        date = new Date(year, month - 1, day);
      }
    }
    
    // Return ISO date string if valid
    if (date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return '';
  };

  // Initialize display value
  useEffect(() => {
    setInputValue(formatDateForDisplay(value));
  }, [value]);

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setInputValue(userInput);
    
    // Try to parse and convert the input
    const parsedDate = parseUserInput(userInput);
    if (parsedDate) {
      onChange(parsedDate);
    } else if (!userInput) {
      // Clear the date if input is empty
      onChange('');
    }
  };

  const handleInputBlur = () => {
    // Re-format the display value when losing focus
    if (value) {
      setInputValue(formatDateForDisplay(value));
    }
  };

  const handlePickerChange = (e) => {
    const dateValue = e.target.value; // Already in YYYY-MM-DD format
    onChange(dateValue);
    setInputValue(formatDateForDisplay(dateValue));
    setShowPicker(false);
  };

  const handleCalendarClick = () => {
    if (!disabled) {
      setShowPicker(!showPicker);
    }
  };

  const handleKeyDown = (e) => {
    // Allow normal typing, backspace, delete, arrow keys, tab
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }
    
    // Allow numbers and forward slash
    if (!/[\d\/]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const baseClassName = `
    w-full px-3 py-2 pr-10 border rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const inputId = `date-input-${name || Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  return (
    <div className="relative">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Visible input for manual typing */}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={baseClassName}
          disabled={disabled}
          required={required}
          aria-describedby={`${helpId} ${error ? errorId : ''}`.trim()}
          aria-invalid={error ? 'true' : 'false'}
        />
        
        {/* Calendar icon button */}
        <button
          type="button"
          onClick={handleCalendarClick}
          className={`absolute right-0 top-0 h-full px-3 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md ${
            disabled ? 'cursor-not-allowed text-gray-400' : 'text-gray-500 hover:text-gray-700'
          }`}
          disabled={disabled}
          tabIndex={-1}
          aria-label="Open date picker"
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
        
        {/* Hidden HTML5 date picker */}
        {showPicker && (
          <input
            ref={hiddenInputRef}
            type="date"
            value={formatDateForInput(value)}
            onChange={handlePickerChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 1000 }}
          />
        )}
      </div>
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      <div id={helpId} className="mt-1 text-xs text-gray-500">
        Enter date as MM/DD/YYYY or click calendar icon
      </div>
    </div>
  );
};

export default DateInput;
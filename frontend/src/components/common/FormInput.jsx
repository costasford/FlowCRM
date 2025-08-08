import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Reusable form input component with validation
 */
export const FormInput = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder = '',
  className = '',
  disabled = false,
  autoComplete,
  ...props
}) => {
  const baseInputClasses = `
    mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm
    focus:outline-none focus:ring-1 transition-colors
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${error && touched 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
  `;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(name, e.target.value)}
          onBlur={(e) => onBlur && onBlur(name)}
          placeholder={placeholder}
          className={`${baseInputClasses.trim()} ${error && touched ? 'pr-10' : ''}`}
          disabled={disabled}
          autoComplete={autoComplete}
          {...props}
        />
        {error && touched && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

/**
 * Form textarea component with validation
 */
export const FormTextarea = ({
  label,
  name,
  value = '',
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder = '',
  rows = 3,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseTextareaClasses = `
    mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm
    focus:outline-none focus:ring-1 transition-colors resize-vertical
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${error && touched 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
  `;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange && onChange(name, e.target.value)}
        onBlur={(e) => onBlur && onBlur(name)}
        placeholder={placeholder}
        rows={rows}
        className={baseTextareaClasses.trim()}
        disabled={disabled}
        {...props}
      />
      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

/**
 * Form select component with validation
 */
export const FormSelect = ({
  label,
  name,
  value = '',
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  options = [],
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseSelectClasses = `
    mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-sm
    focus:outline-none focus:ring-1 transition-colors
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${error && touched 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
  `;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange && onChange(name, e.target.value)}
        onBlur={(e) => onBlur && onBlur(name)}
        className={baseSelectClasses.trim()}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

/**
 * Form checkbox component
 */
export const FormCheckbox = ({
  label,
  name,
  checked = false,
  onChange,
  error,
  touched,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(name, e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={disabled}
          {...props}
        />
        {label && (
          <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
      </div>
      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

/**
 * Form field wrapper for custom inputs
 */
export const FormField = ({
  label,
  name,
  required = false,
  error,
  touched,
  className = '',
  children
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1">
        {children}
      </div>
      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormField,
};
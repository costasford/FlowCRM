// Comprehensive form validation utilities for FlowCRM

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Collection of validation rules
 */
export const validators = {
  // Basic validators
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new ValidationError('required', `${fieldName} is required`);
    }
    return value;
  },

  minLength: (min) => (value, fieldName = 'Field') => {
    if (value && value.length < min) {
      throw new ValidationError('minLength', `${fieldName} must be at least ${min} characters`);
    }
    return value;
  },

  maxLength: (max) => (value, fieldName = 'Field') => {
    if (value && value.length > max) {
      throw new ValidationError('maxLength', `${fieldName} must be no more than ${max} characters`);
    }
    return value;
  },

  // Email validation
  email: (value, fieldName = 'Email') => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new ValidationError('email', `${fieldName} must be a valid email address`);
    }
    return value;
  },

  // Phone validation (flexible format)
  phone: (value, fieldName = 'Phone') => {
    if (value && !/^[\+]?[\s\-\(\)]?[\d\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ''))) {
      throw new ValidationError('phone', `${fieldName} must be a valid phone number`);
    }
    return value;
  },

  // URL validation
  url: (value, fieldName = 'URL') => {
    if (value && !/^https?:\/\/.+/.test(value)) {
      throw new ValidationError('url', `${fieldName} must be a valid URL starting with http:// or https://`);
    }
    return value;
  },

  // Number validation
  number: (value, fieldName = 'Field') => {
    if (value !== '' && value !== null && value !== undefined && isNaN(Number(value))) {
      throw new ValidationError('number', `${fieldName} must be a valid number`);
    }
    return value;
  },

  min: (minValue) => (value, fieldName = 'Field') => {
    if (value !== '' && value !== null && value !== undefined && Number(value) < minValue) {
      throw new ValidationError('min', `${fieldName} must be at least ${minValue}`);
    }
    return value;
  },

  max: (maxValue) => (value, fieldName = 'Field') => {
    if (value !== '' && value !== null && value !== undefined && Number(value) > maxValue) {
      throw new ValidationError('max', `${fieldName} must be no more than ${maxValue}`);
    }
    return value;
  },

  // Date validation
  date: (value, fieldName = 'Date') => {
    if (value && isNaN(Date.parse(value))) {
      throw new ValidationError('date', `${fieldName} must be a valid date`);
    }
    return value;
  },

  futureDate: (value, fieldName = 'Date') => {
    if (value && new Date(value) <= new Date()) {
      throw new ValidationError('futureDate', `${fieldName} must be in the future`);
    }
    return value;
  },

  pastDate: (value, fieldName = 'Date') => {
    if (value && new Date(value) >= new Date()) {
      throw new ValidationError('pastDate', `${fieldName} must be in the past`);
    }
    return value;
  },

  // Custom pattern validation
  pattern: (regex, message) => (value, fieldName = 'Field') => {
    if (value && !regex.test(value)) {
      throw new ValidationError('pattern', message || `${fieldName} format is invalid`);
    }
    return value;
  },

  // Conditional validation
  when: (condition, validator) => (value, fieldName, allValues) => {
    if (condition(allValues)) {
      return validator(value, fieldName, allValues);
    }
    return value;
  },
};

/**
 * Compose multiple validators for a field
 */
export const compose = (...validators) => (value, fieldName, allValues) => {
  return validators.reduce((acc, validator) => {
    return validator(acc, fieldName, allValues);
  }, value);
};

/**
 * Validation schemas for different entities
 */
export const validationSchemas = {
  contact: {
    name: compose(validators.required, validators.maxLength(100)),
    email: compose(validators.required, validators.email, validators.maxLength(255)),
    phone: compose(validators.phone),
    company: compose(validators.maxLength(100)),
  },

  company: {
    name: compose(validators.required, validators.maxLength(100)),
    email: compose(validators.email, validators.maxLength(255)),
    phone: compose(validators.phone),
    website: compose(validators.url, validators.maxLength(255)),
    location: compose(validators.maxLength(255)),
    description: compose(validators.maxLength(1000)),
  },

  deal: {
    title: compose(validators.required, validators.maxLength(200)),
    description: compose(validators.maxLength(1000)),
    value: compose(validators.number, validators.min(0)),
    probability: compose(validators.number, validators.min(0), validators.max(100)),
    stage: compose(validators.required),
    priority: compose(validators.required),
    closeDate: compose(validators.date),
  },

  task: {
    title: compose(validators.required, validators.maxLength(200)),
    description: compose(validators.maxLength(1000)),
    priority: compose(validators.required),
    dueDate: compose(validators.date),
  },

  activity: {
    type: compose(validators.required),
    title: compose(validators.required, validators.maxLength(200)),
    description: compose(validators.maxLength(1000)),
  },

  user: {
    name: compose(validators.required, validators.maxLength(100)),
    email: compose(validators.required, validators.email, validators.maxLength(255)),
    password: compose(validators.required, validators.minLength(6), validators.maxLength(128)),
    role: compose(validators.required),
  },
};

/**
 * Validate a single field
 */
export const validateField = (value, fieldName, schema, allValues = {}) => {
  try {
    if (schema[fieldName]) {
      schema[fieldName](value, fieldName, allValues);
    }
    return null; // No error
  } catch (error) {
    if (error instanceof ValidationError) {
      return error.message;
    }
    throw error;
  }
};

/**
 * Validate entire form object
 */
export const validateForm = (formData, schema) => {
  const errors = {};
  let hasErrors = false;

  for (const fieldName in schema) {
    const error = validateField(formData[fieldName], fieldName, schema, formData);
    if (error) {
      errors[fieldName] = error;
      hasErrors = true;
    }
  }

  return { errors, isValid: !hasErrors };
};

/**
 * React hook for form validation
 */
import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, schema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((fieldName, value) => {
    const error = validateField(value, fieldName, schema, values);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  }, [schema, values]);

  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate field if it has been touched
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, values[fieldName]);
  }, [values, validateField]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      const { errors: formErrors, isValid } = validateForm(values, schema);
      setErrors(formErrors);
      setTouched(Object.keys(schema).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      
      if (isValid) {
        onSubmit(values);
      }
    };
  }, [values, schema]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
};

export default {
  validators,
  validationSchemas,
  validateField,
  validateForm,
  useFormValidation,
  ValidationError,
};
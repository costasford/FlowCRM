import { validators, validateField, validateForm, ValidationError } from '../../utils/validation';

describe('ValidationError', () => {
  test('creates error with field and message', () => {
    const error = new ValidationError('email', 'Invalid email format');
    expect(error.field).toBe('email');
    expect(error.message).toBe('Invalid email format');
    expect(error.name).toBe('ValidationError');
  });
});

describe('validators', () => {
  describe('required', () => {
    test('passes for non-empty values', () => {
      expect(validators.required('test')).toBe('test');
      expect(validators.required('0')).toBe('0');
      expect(validators.required(1)).toBe(1);
    });

    test('throws for empty values', () => {
      expect(() => validators.required('')).toThrow('Field is required');
      expect(() => validators.required(null)).toThrow('Field is required');
      expect(() => validators.required(undefined)).toThrow('Field is required');
    });

    test('uses custom field name in error message', () => {
      expect(() => validators.required('', 'Email')).toThrow('Email is required');
    });
  });

  describe('email', () => {
    test('passes for valid email addresses', () => {
      expect(validators.email('test@example.com')).toBe('test@example.com');
      expect(validators.email('user.name+tag@example.co.uk')).toBe('user.name+tag@example.co.uk');
      expect(validators.email('')).toBe(''); // Empty is valid (use required separately)
    });

    test('throws for invalid email addresses', () => {
      expect(() => validators.email('invalid')).toThrow('must be a valid email address');
      expect(() => validators.email('test@')).toThrow('must be a valid email address');
      expect(() => validators.email('@example.com')).toThrow('must be a valid email address');
      expect(() => validators.email('test.example.com')).toThrow('must be a valid email address');
    });

    test('uses custom field name in error message', () => {
      expect(() => validators.email('invalid', 'Contact Email')).toThrow('Contact Email must be a valid email address');
    });
  });

  describe('minLength', () => {
    test('passes for strings meeting minimum length', () => {
      const minLength5 = validators.minLength(5);
      expect(minLength5('hello')).toBe('hello');
      expect(minLength5('hello world')).toBe('hello world');
      expect(minLength5('')).toBe(''); // Empty is valid (use required separately)
    });

    test('throws for strings below minimum length', () => {
      const minLength5 = validators.minLength(5);
      expect(() => minLength5('hi')).toThrow('must be at least 5 characters');
    });

    test('uses custom field name in error message', () => {
      const minLength5 = validators.minLength(5);
      expect(() => minLength5('hi', 'Password')).toThrow('Password must be at least 5 characters');
    });
  });

  describe('maxLength', () => {
    test('passes for strings within maximum length', () => {
      const maxLength10 = validators.maxLength(10);
      expect(maxLength10('hello')).toBe('hello');
      expect(maxLength10('1234567890')).toBe('1234567890');
      expect(maxLength10('')).toBe('');
    });

    test('throws for strings exceeding maximum length', () => {
      const maxLength10 = validators.maxLength(10);
      expect(() => maxLength10('this is too long')).toThrow('must be no more than 10 characters');
    });
  });

  describe('pattern', () => {
    test('passes for strings matching pattern', () => {
      const phonePattern = validators.pattern(/^\d{3}-\d{3}-\d{4}$/);
      expect(phonePattern('123-456-7890')).toBe('123-456-7890');
      expect(phonePattern('')).toBe(''); // Empty is valid
    });

    test('throws for strings not matching pattern', () => {
      const phonePattern = validators.pattern(/^\d{3}-\d{3}-\d{4}$/);
      expect(() => phonePattern('1234567890')).toThrow('format is invalid');
    });

    test('uses custom error message', () => {
      const phonePattern = validators.pattern(/^\d{3}-\d{3}-\d{4}$/, 'must be in XXX-XXX-XXXX format');
      expect(() => phonePattern('1234567890')).toThrow('must be in XXX-XXX-XXXX format');
    });
  });

  describe('min and max', () => {
    test('numeric validators work correctly', () => {
      const min5 = validators.min(5);
      const max100 = validators.max(100);

      expect(min5(10)).toBe(10);
      expect(max100(50)).toBe(50);
      expect(() => min5(3)).toThrow('must be at least 5');
      expect(() => max100(150)).toThrow('must be no more than 100');
    });
  });
});

describe('validateField', () => {
  test('returns null for valid values', () => {
    const schema = { email: validators.email };
    expect(validateField('test@example.com', 'email', schema)).toBe(null);
  });

  test('returns error message for invalid values', () => {
    const schema = { email: validators.email };
    expect(validateField('invalid', 'email', schema)).toContain('must be a valid email address');
  });

  test('returns null for valid required field', () => {
    const schema = { name: validators.required };
    expect(validateField('John Doe', 'name', schema)).toBe(null);
  });

  test('returns error for empty required field', () => {
    const schema = { name: validators.required };
    expect(validateField('', 'name', schema)).toContain('is required');
  });
});

describe('validateForm', () => {
  // Import compose function and use it properly
  const schema = {
    email: (value, fieldName, allValues) => {
      validators.required(value, fieldName);
      validators.email(value, fieldName);
      return value;
    },
    password: (value, fieldName, allValues) => {
      validators.required(value, fieldName);
      validators.minLength(8)(value, fieldName);
      return value;
    },
    age: (value, fieldName, allValues) => {
      validators.required(value, fieldName);
      validators.min(18)(value, fieldName);
      return value;
    }
  };

  test('returns validation result for valid form', () => {
    const formData = {
      email: 'test@example.com',
      password: 'password123',
      age: 25
    };

    const result = validateForm(formData, schema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('returns validation errors for invalid form', () => {
    const formData = {
      email: 'invalid',
      password: 'short',
      age: 15
    };

    const result = validateForm(formData, schema);
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });

  test('collects all field errors', () => {
    const formData = {
      email: '',
      password: 'short',
      age: 15
    };

    const result = validateForm(formData, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
    expect(result.errors).toHaveProperty('age');
  });

  test('validates optional fields only if present', () => {
    const formData = {
      email: 'test@example.com',
      password: 'password123',
      age: 25,
      optionalField: undefined
    };

    const schemaWithOptional = {
      ...schema,
      optionalField: validators.email // Optional field without required validator
    };

    const result = validateForm(formData, schemaWithOptional);
    expect(result.isValid).toBe(true);
  });
});
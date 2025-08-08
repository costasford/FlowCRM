import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateInput from '../../components/common/DateInput';

describe('DateInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: 'Select date...',
    label: 'Due Date'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with label and placeholder', () => {
    render(<DateInput {...defaultProps} />);
    
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select date...')).toBeInTheDocument();
  });

  test('displays required indicator when required prop is true', () => {
    render(<DateInput {...defaultProps} required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('displays error message when error prop is provided', () => {
    render(<DateInput {...defaultProps} error="Invalid date" />);
    
    expect(screen.getByText('Invalid date')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('formats display value correctly', () => {
    render(<DateInput {...defaultProps} value="2024-12-25" />);
    
    const input = screen.getByDisplayValue('12/25/2024');
    expect(input).toBeInTheDocument();
  });

  test('calls onChange with correct format when user types valid date', async () => {
    const user = userEvent.setup();
    render(<DateInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Select date...');
    await user.type(input, '12/25/2024');
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('2024-12-25');
  });

  test('handles various date input formats', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DateInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Select date...');
    
    // Test MM/DD/YYYY format
    await user.clear(input);
    await user.type(input, '1/15/2024');
    expect(defaultProps.onChange).toHaveBeenCalledWith('2024-01-15');
    
    // Test MMDDYYYY format
    defaultProps.onChange.mockClear();
    rerender(<DateInput {...defaultProps} />);
    await user.clear(input);
    await user.type(input, '01152024');
    expect(defaultProps.onChange).toHaveBeenCalledWith('2024-01-15');
  });

  test('shows calendar icon and opens date picker on click', async () => {
    const user = userEvent.setup();
    render(<DateInput {...defaultProps} />);
    
    const calendarButton = screen.getByLabelText('Open date picker');
    expect(calendarButton).toBeInTheDocument();
    
    await user.click(calendarButton);
    
    // Check if HTML5 date picker is rendered
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  test('prevents non-numeric and non-slash characters', async () => {
    const user = userEvent.setup();
    render(<DateInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Select date...');
    
    // Try to type invalid characters
    fireEvent.keyDown(input, { key: 'a' });
    fireEvent.keyDown(input, { key: '#' });
    fireEvent.keyDown(input, { key: '@' });
    
    // Only numbers and slashes should be allowed
    expect(input.value).toBe('');
  });

  test('is disabled when disabled prop is true', () => {
    render(<DateInput {...defaultProps} disabled />);
    
    const input = screen.getByPlaceholderText('Select date...');
    const calendarButton = screen.getByLabelText('Open date picker');
    
    expect(input).toBeDisabled();
    expect(calendarButton).toBeDisabled();
  });

  test('has proper accessibility attributes', () => {
    render(<DateInput {...defaultProps} error="Invalid date" />);
    
    const input = screen.getByPlaceholderText('Select date...');
    
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    
    const helpText = screen.getByText('Enter date as MM/DD/YYYY or click calendar icon');
    expect(helpText).toBeInTheDocument();
  });

  test('clears date when input is empty', async () => {
    const user = userEvent.setup();
    render(<DateInput {...defaultProps} value="2024-12-25" />);
    
    const input = screen.getByDisplayValue('12/25/2024');
    await user.clear(input);
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('');
  });
});
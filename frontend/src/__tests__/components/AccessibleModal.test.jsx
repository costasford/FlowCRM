import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibleModal from '../../components/common/AccessibleModal';

describe('AccessibleModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock focus method
    HTMLElement.prototype.focus = jest.fn();
  });

  test('renders when isOpen is true', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<AccessibleModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('has proper ARIA attributes', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  test('shows close button by default', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeInTheDocument();
  });

  test('hides close button when showCloseButton is false', () => {
    render(<AccessibleModal {...defaultProps} showCloseButton={false} />);
    
    const closeButton = screen.queryByLabelText('Close modal');
    expect(closeButton).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccessibleModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('calls onClose when backdrop is clicked and closeOnBackdropClick is true', async () => {
    const user = userEvent.setup();
    render(<AccessibleModal {...defaultProps} closeOnBackdropClick={true} />);
    
    // Click on the backdrop (the outer div)
    const backdrop = screen.getByRole('dialog').parentElement;
    await user.click(backdrop);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('does not close when backdrop is clicked and closeOnBackdropClick is false', async () => {
    const user = userEvent.setup();
    render(<AccessibleModal {...defaultProps} closeOnBackdropClick={false} />);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    await user.click(backdrop);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test('closes on Escape key press', () => {
    render(<AccessibleModal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('applies correct size classes', () => {
    const { rerender } = render(<AccessibleModal {...defaultProps} size="sm" />);
    expect(screen.getByRole('dialog')).toHaveClass('sm:max-w-md');
    
    rerender(<AccessibleModal {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog')).toHaveClass('sm:max-w-2xl');
    
    rerender(<AccessibleModal {...defaultProps} size="xl" />);
    expect(screen.getByRole('dialog')).toHaveClass('sm:max-w-4xl');
  });

  test('prevents body scroll when modal is open', () => {
    const originalOverflow = document.body.style.overflow;
    
    render(<AccessibleModal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    // Cleanup should restore overflow
    return () => {
      expect(document.body.style.overflow).toBe(originalOverflow);
    };
  });

  test('traps focus within modal', async () => {
    render(
      <AccessibleModal {...defaultProps}>
        <button>First Button</button>
        <button>Second Button</button>
      </AccessibleModal>
    );

    const firstButton = screen.getByText('First Button');
    const secondButton = screen.getByText('Second Button');
    const closeButton = screen.getByLabelText('Close modal');

    // Tab should cycle through focusable elements
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.keyDown(document, { key: 'Tab' });
    fireEvent.keyDown(document, { key: 'Tab' });
    
    // Should wrap back to first element
    fireEvent.keyDown(document, { key: 'Tab' });
    
    // Shift+Tab should go backwards
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  });

  test('focuses modal on mount', async () => {
    render(<AccessibleModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(HTMLElement.prototype.focus).toHaveBeenCalled();
    });
  });
});
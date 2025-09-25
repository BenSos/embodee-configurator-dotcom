import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-8', 'h-8'); // default md size
  });

  it('should render with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  it('should render with message', () => {
    render(<LoadingSpinner message="Loading..." />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const container = screen.getByTestId('loading-spinner').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should render all size variants', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('w-8', 'h-8');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('w-12', 'h-12');
  });
});

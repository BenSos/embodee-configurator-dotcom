import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfiguratorError from './ConfiguratorError';

describe('ConfiguratorError', () => {
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no error', () => {
    render(
      <ConfiguratorError
        error={null}
        isRetrying={false}
        retryCount={0}
        onRetry={mockOnRetry}
      />
    );
    
    expect(screen.queryByText('Configurator Error')).not.toBeInTheDocument();
  });

  it('should render general error', () => {
    render(
      <ConfiguratorError
        error="Something went wrong"
        isRetrying={false}
        retryCount={0}
        onRetry={mockOnRetry}
      />
    );
    
    expect(screen.getByText('Configurator Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render configuration error', () => {
    render(
      <ConfiguratorError
        error="Invalid workspaceID"
        isRetrying={false}
        retryCount={0}
        onRetry={mockOnRetry}
      />
    );
    
    expect(screen.getByText('Configuration Error')).toBeInTheDocument();
    expect(screen.getByText('The workspace or product ID is invalid. Please check your configuration.')).toBeInTheDocument();
  });

  it('should render network error', () => {
    render(
      <ConfiguratorError
        error="Network error"
        isRetrying={false}
        retryCount={0}
        onRetry={mockOnRetry}
      />
    );
    
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText('Unable to connect to the configurator service. Please check your internet connection.')).toBeInTheDocument();
  });

  it('should render script error', () => {
    render(
      <ConfiguratorError
        error="3D viewer script failed to load"
        isRetrying={false}
        retryCount={0}
        onRetry={mockOnRetry}
      />
    );
    
    expect(screen.getByText('3D Viewer Error')).toBeInTheDocument();
    expect(screen.getByText('The 3D viewer failed to load. This may be due to browser compatibility or network issues.')).toBeInTheDocument();
  });

  it('should show retry state when retrying', () => {
    render(
      <ConfiguratorError
        error="Network error"
        isRetrying={true}
        retryCount={2}
        onRetry={mockOnRetry}
      />
    );
    
    expect(screen.getByText('Retrying... (2/3)')).toBeInTheDocument();
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    render(
      <ConfiguratorError
        error="Something went wrong"
        isRetrying={false}
        retryCount={0}
        onRetry={mockOnRetry}
      />
    );
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should render with custom className', () => {
    render(
      <ConfiguratorError
        error="Something went wrong"
        isRetrying={false}
        retryCount={0}
        onRetry={mockOnRetry}
        className="custom-class"
      />
    );
    
    const container = screen.getByText('Configurator Error').closest('div')?.parentElement;
    expect(container).toHaveClass('custom-class');
  });
});

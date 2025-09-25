import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ConfiguratorLoading from './ConfiguratorLoading';

describe('ConfiguratorLoading', () => {
  it('should not render when not loading', () => {
    render(
      <ConfiguratorLoading
        isLoading={false}
        isRetrying={false}
        retryCount={0}
      />
    );
    
    expect(screen.queryByText('Loading configurator...')).not.toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(
      <ConfiguratorLoading
        isLoading={true}
        isRetrying={false}
        retryCount={0}
      />
    );
    
    expect(screen.getByText('Loading configurator...')).toBeInTheDocument();
  });

  it('should render retry state', () => {
    render(
      <ConfiguratorLoading
        isLoading={false}
        isRetrying={true}
        retryCount={1}
      />
    );
    
    expect(screen.getByText('Retrying... (1/3)')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(
      <ConfiguratorLoading
        isLoading={true}
        isRetrying={false}
        retryCount={0}
        message="Custom loading message"
      />
    );
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('should show retry help text when retrying', () => {
    render(
      <ConfiguratorLoading
        isLoading={false}
        isRetrying={true}
        retryCount={1}
      />
    );
    
    expect(screen.getByText('Having trouble connecting to the configurator.')).toBeInTheDocument();
    expect(screen.getByText('This usually resolves automatically.')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(
      <ConfiguratorLoading
        isLoading={true}
        isRetrying={false}
        retryCount={0}
        className="custom-class"
      />
    );
    
    const container = screen.getByText('Loading configurator...').closest('div')?.parentElement;
    expect(container).toHaveClass('custom-class');
  });
});

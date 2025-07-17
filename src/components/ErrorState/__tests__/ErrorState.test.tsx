import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorState message="Test error message" onRetry={() => {}} />);
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState message="Test error message" />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Test error message" onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

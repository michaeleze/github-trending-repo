import { render, screen } from '@testing-library/react';
import LoadingState from './LoadingState';

describe('LoadingState', () => {
  it('renders loading message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading repositories...')).toBeInTheDocument();
  });

  it('renders spinner', () => {
    render(<LoadingState />);
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});
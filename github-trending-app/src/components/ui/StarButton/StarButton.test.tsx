import { render, screen, fireEvent } from '@testing-library/react';
import StarButton from './StarButton';

describe('StarButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filled star when isStarred is true', () => {
    render(<StarButton isStarred={true} onClick={mockOnClick} />);
    
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.queryByText('☆')).not.toBeInTheDocument();
    expect(screen.getByText('Remove from starred')).toBeInTheDocument();
  });

  it('renders outline star when isStarred is false', () => {
    render(<StarButton isStarred={false} onClick={mockOnClick} />);
    
    expect(screen.getByText('☆')).toBeInTheDocument();
    expect(screen.queryByText('★')).not.toBeInTheDocument();
    expect(screen.getByText('Add to starred')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    render(<StarButton isStarred={false} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label based on isStarred prop', () => {
    const { rerender } = render(<StarButton isStarred={false} onClick={mockOnClick} />);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'star');
    
    rerender(<StarButton isStarred={true} onClick={mockOnClick} />);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'unstar');
  });
});
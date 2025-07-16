import { render, screen } from '@testing-library/react';
import StarCount from './StarCount';

describe('StarCount', () => {
  it('renders the star count', () => {
    render(<StarCount count={42} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('formats large numbers with k suffix', () => {
    render(<StarCount count={1500} />);
    
    expect(screen.getByText('1.5k')).toBeInTheDocument();
  });

  it('formats very large numbers with k suffix', () => {
    render(<StarCount count={15000} />);
    
    expect(screen.getByText('15.0k')).toBeInTheDocument();
  });

  it('does not format numbers less than 1000', () => {
    render(<StarCount count={999} />);
    
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<StarCount count={42} />);
    
    const container = screen.getByText('42').closest('div');
    expect(container).toHaveClass('starCount');
    
    const icon = screen.getByText('★');
    expect(icon).toHaveClass('starIcon');
    
    const label = screen.getByText('42');
    expect(label).toHaveClass('label');
  });
});
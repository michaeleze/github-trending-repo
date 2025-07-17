import { render, screen } from '@testing-library/react';
import StarCount from './StarCount';

describe('StarCount', () => {
  it('renders star count with formatted number', () => {
    render(<StarCount count={1234} />);
    
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('renders star count without formatting for small numbers', () => {
    render(<StarCount count={42} />);
    
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders zero count', () => {
    render(<StarCount count={0} />);
    
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders large numbers with k suffix', () => {
    render(<StarCount count={15000} />);
    
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('15.0k')).toBeInTheDocument();
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import SortControl from './SortControl';

describe('SortControl', () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sort control with default value', () => {
    render(<SortControl onSortChange={mockOnSortChange} />);
    
    const selectElement = screen.getByLabelText('Sort By') as HTMLSelectElement;
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.value).toBe('stargazers_count');
  });

  it('calls onSortChange when selection changes', () => {
    render(<SortControl onSortChange={mockOnSortChange} />);
    
    const selectElement = screen.getByLabelText('Sort By');
    fireEvent.change(selectElement, { target: { value: 'language' } });
    
    expect(mockOnSortChange).toHaveBeenCalledWith('language');
  });

  it('renders all available sort options', () => {
    render(<SortControl onSortChange={mockOnSortChange} />);
    
    expect(screen.getByText('Stars')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
  });
});
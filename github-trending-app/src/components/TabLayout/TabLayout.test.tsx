import { render, screen, fireEvent } from '@testing-library/react';
import TabLayout from './TabLayout';

describe('TabLayout', () => {
  const mockTabs = [
    { label: 'Tab 1', content: <div>Content 1</div> },
    { label: 'Tab 2', content: <div>Content 2</div> },
  ];

  it('renders the title and tabs', () => {
    render(<TabLayout title="Test Title" tabs={mockTabs} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('displays the first tab content by default', () => {
    render(<TabLayout title="Test Title" tabs={mockTabs} />);
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeVisible();
  });

  it('switches tab content when clicking on a tab', () => {
    render(<TabLayout title="Test Title" tabs={mockTabs} />);
    
    // Click on the second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // First tab content should be hidden, second tab content should be visible
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('applies active class to the selected tab', () => {
    render(<TabLayout title="Test Title" tabs={mockTabs} />);
    
    // First tab should be active by default
    const firstTab = screen.getByText('Tab 1').closest('button');
    const secondTab = screen.getByText('Tab 2').closest('button');
    
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(secondTab).toHaveAttribute('aria-selected', 'false');
    
    // Click on the second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // Second tab should now be active
    expect(firstTab).toHaveAttribute('aria-selected', 'false');
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });
});
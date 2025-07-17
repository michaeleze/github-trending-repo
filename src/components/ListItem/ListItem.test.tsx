import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from './ListItem';
import type { Repository } from '@/types';

// Mock the child components
jest.mock('../ui/StarButton', () => {
  return {
    __esModule: true,
    default: ({ isStarred, onClick }: { isStarred: boolean; onClick: () => void }) => (
      <button data-testid="star-button" onClick={onClick}>
        {isStarred ? 'Starred' : 'Not Starred'}
      </button>
    ),
  };
});

jest.mock('../ui/LanguageChip', () => {
  return {
    __esModule: true,
    default: ({ language }: { language: string }) => (
      <div data-testid="language-chip">{language}</div>
    ),
  };
});

jest.mock('../ui/StarCount/StarCount', () => {
  return {
    __esModule: true,
    default: ({ count }: { count: number }) => (
      <div data-testid="star-count">{count}</div>
    ),
  };
});

describe('ListItem', () => {
  const mockRepository: Repository = {
    id: 1,
    name: 'test-repo',
    full_name: 'user/test-repo',
    owner: {
      login: 'user'
    },
    created_at: '2023-01-01T00:00:00Z',
    html_url: 'https://github.com/user/test-repo',
    description: 'Test repository description',
    stargazers_count: 100,
    language: 'TypeScript',
    isStarred: false
  };

  const mockToggleStar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders repository name as a link', () => {
    render(<ListItem repository={mockRepository} onToggleStar={mockToggleStar} />);
    
    const link = screen.getByText('test-repo');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', 'https://github.com/user/test-repo');
  });

  it('renders repository description', () => {
    render(<ListItem repository={mockRepository} onToggleStar={mockToggleStar} />);
    
    expect(screen.getByText('Test repository description')).toBeInTheDocument();
  });

  it('renders fallback text when description is null', () => {
    const repoWithoutDesc = { ...mockRepository, description: null };
    render(<ListItem repository={repoWithoutDesc} onToggleStar={mockToggleStar} />);
    
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('calls onToggleStar when star button is clicked', () => {
    render(<ListItem repository={mockRepository} onToggleStar={mockToggleStar} />);
    
    fireEvent.click(screen.getByTestId('star-button'));
    expect(mockToggleStar).toHaveBeenCalledWith(mockRepository.id);
  });
});
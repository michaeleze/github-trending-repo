import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
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
    default: ({ language }: { language: string | null }) => (
      language ? <div data-testid="language-chip">{language}</div> : null
    ),
  };
});

jest.mock('../ui/StarCount', () => {
  return {
    __esModule: true,
    default: ({ count }: { count: number }) => (
      <div data-testid="star-count">{count}</div>
    ),
  };
});

describe('Card', () => {
  const mockRepository: Repository = {
    id: 1,
    owner: {
      login: 'user'
    },
    created_at: '2023-01-01T00:00:00Z',
    name: 'test-repo',
    full_name: 'user/test-repo',
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

  it('renders repository information correctly', () => {
    render(<Card repository={mockRepository} onToggleStar={mockToggleStar} />);

    expect(screen.getByText('user/test-repo')).toBeInTheDocument();
    expect(screen.getByText('Test repository description')).toBeInTheDocument();
    expect(screen.getByTestId('language-chip')).toBeInTheDocument();
    expect(screen.getByTestId('star-count')).toBeInTheDocument();
    expect(screen.getByTestId('star-button')).toBeInTheDocument();
  });

  it('renders "No description available" when description is null', () => {
    const repoWithoutDesc = { ...mockRepository, description: null };
    render(<Card repository={repoWithoutDesc} onToggleStar={mockToggleStar} />);

    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('calls onToggleStar when star button is clicked', () => {
    render(<Card repository={mockRepository} onToggleStar={mockToggleStar} />);

    fireEvent.click(screen.getByTestId('star-button'));
    expect(mockToggleStar).toHaveBeenCalledWith(mockRepository);
  });
});

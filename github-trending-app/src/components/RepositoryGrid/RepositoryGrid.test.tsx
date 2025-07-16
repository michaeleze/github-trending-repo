import { render, screen } from '@testing-library/react';
import RepositoryGrid from './RepositoryGrid';
import type { Repository } from '@/types';

// Mock the child components
jest.mock('../RepositoryCard', () => {
  return {
    __esModule: true,
    default: ({ repository }: { repository: Repository }) => (
      <div data-testid={`repository-card-${repository.id}`}>
        {repository.full_name}
      </div>
    ),
  };
});

jest.mock('../SortControl', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="sort-control">Sort Control</div>
    ),
  };
});

describe('RepositoryGrid', () => {
  const mockRepositories: Repository[] = [
    {
      id: 1,
      name: 'repo-1',
      full_name: 'user/repo-1',
      html_url: 'https://github.com/user/repo-1',
      description: 'Repository 1 description',
      stargazers_count: 100,
      language: 'TypeScript',
      isStarred: false
    },
    {
      id: 2,
      name: 'repo-2',
      full_name: 'user/repo-2',
      html_url: 'https://github.com/user/repo-2',
      description: 'Repository 2 description',
      stargazers_count: 200,
      language: 'JavaScript',
      isStarred: true
    }
  ];

  const mockToggleStar = jest.fn();
  const mockOnSort = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders repository cards when repositories are provided', () => {
    render(
      <RepositoryGrid
        repositories={mockRepositories}
        onToggleStar={mockToggleStar}
        onSort={mockOnSort}
      />
    );

    expect(screen.getByTestId('sort-control')).toBeInTheDocument();
    expect(screen.getByTestId('repository-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('repository-card-2')).toBeInTheDocument();
  });

  it('renders empty message when no repositories are provided', () => {
    render(
      <RepositoryGrid
        repositories={[]}
        onToggleStar={mockToggleStar}
        onSort={mockOnSort}
        emptyMessage="Custom empty message"
      />
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    expect(screen.queryByTestId('repository-card-1')).not.toBeInTheDocument();
  });

  it('uses default empty message when not provided', () => {
    render(
      <RepositoryGrid
        repositories={[]}
        onToggleStar={mockToggleStar}
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('No repositories found.')).toBeInTheDocument();
  });
});

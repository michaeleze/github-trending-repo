import { render, screen } from '@testing-library/react';
import Grid from './Grid';
import type { Repository } from '@/types';

// Mock the child components
jest.mock('../Card', () => {
  return {
    __esModule: true,
    default: ({ repository }: { repository: Repository }) => (
      <div data-testid={`repository-card-${repository.id}`}>
        {repository.full_name}
      </div>
    ),
  };
});

describe('Grid', () => {
  const mockRepositories: Repository[] = [
    {
      id: 1,
      name: 'repo-1',
      full_name: 'user/repo-1',
      owner: {
        login: 'user'
      },
      created_at: '2023-01-01T00:00:00Z',
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
      owner: {
        login: 'user'
      },
      created_at: '2023-01-02T00:00:00Z',
      html_url: 'https://github.com/user/repo-2',
      description: 'Repository 2 description',
      stargazers_count: 200,
      language: 'JavaScript',
      isStarred: true
    }
  ];

  const mockToggleStar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders repository cards when repositories are provided', () => {
    render(
      <Grid
        repositories={mockRepositories}
        onToggleStar={mockToggleStar}
      />
    );
    expect(screen.getByTestId('repository-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('repository-card-2')).toBeInTheDocument();
  });

  it('renders empty message when no repositories are provided', () => {
    render(
      <Grid
        repositories={[]}
        onToggleStar={mockToggleStar}
        emptyMessage="Custom empty message"
      />
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    expect(screen.queryByTestId('repository-card-1')).not.toBeInTheDocument();
  });

  it('uses default empty message when not provided', () => {
    render(
      <Grid
        repositories={[]}
        onToggleStar={mockToggleStar}
      />
    );

    expect(screen.getByText('No repositories found.')).toBeInTheDocument();
  });
});

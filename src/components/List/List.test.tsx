import { render, screen } from '@testing-library/react';
import List from './List';
import type { Repository } from '@/types';

// Mock the child components
jest.mock('../ListItem', () => {
  return {
    __esModule: true,
    default: ({ repository }: { repository: Repository }) => (
      <div data-testid={`list-item-${repository.id}`}>
        {repository.full_name}
      </div>
    ),
  };
});

describe('List', () => {
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

  it('renders list items for each repository', () => {
    render(
      <List 
        repositories={mockRepositories} 
        onToggleStar={mockToggleStar} 
      />
    );
    
    expect(screen.getByTestId('list-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('list-item-2')).toBeInTheDocument();
  });

  it('renders empty state when no repositories are provided', () => {
    render(<List repositories={[]} />);
    
    expect(screen.getByText('No repositories found.')).toBeInTheDocument();
  });

  it('renders custom empty message when provided', () => {
    const customMessage = 'Custom empty message';
    render(<List repositories={[]} emptyMessage={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
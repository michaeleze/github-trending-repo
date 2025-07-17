import { render, screen, act, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { RepositoriesProvider } from '../Repositories.provider';
import { RepositoriesContext } from '../index';
import { useFetchRepositories, useStarredRepositories, useToggleStar } from '@/hooks';
import type { Repository } from '@/types';

// Mock the hooks
jest.mock('@/hooks');
const mockUseFetchRepositories = useFetchRepositories as jest.MockedFunction<typeof useFetchRepositories>;
const mockUseStarredRepositories = useStarredRepositories as jest.MockedFunction<typeof useStarredRepositories>;
const mockUseToggleStar = useToggleStar as jest.MockedFunction<typeof useToggleStar>;

// Test component to access context
const TestComponent = () => {
  const context = useContext(RepositoriesContext);
  return (
    <div>
      <div data-testid="all-repos-count">{context.allRepositories.length}</div>
      <div data-testid="starred-repos-count">{context.starredRepositories.length}</div>
      <div data-testid="loading">{context.loading.toString()}</div>
      <div data-testid="error">{context.error || 'no-error'}</div>
      <button
        data-testid="toggle-star"
        onClick={() => context?.toggleStar?.(mockRepositories[0])}
      >
        Toggle Star
      </button>
    </div>
  );
};

const mockRepositories: Repository[] = [
  {
    id: 1,
    name: 'test-repo-1',
    full_name: 'user/test-repo-1',
    description: 'Test repository 1',
    html_url: 'https://github.com/user/test-repo-1',
    stargazers_count: 100,
    language: 'TypeScript',
    created_at: '2023-01-01T00:00:00Z',
    owner: {
      login: 'user',
    },
    isStarred: false
  },
  {
    id: 2,
    name: 'test-repo-2',
    full_name: 'user/test-repo-2',
    description: 'Test repository 2',
    html_url: 'https://github.com/user/test-repo-2',
    stargazers_count: 200,
    language: 'JavaScript',
        created_at: '2023-01-01T00:00:00Z',
    owner: {
      login: 'user',
    },
    isStarred: false
  }
];

const mockStarredRepositories: Repository[] = [
  {
    ...mockRepositories[0],
    isStarred: true
  }
];

describe('RepositoriesProvider', () => {
  const mockToggleStar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockUseFetchRepositories.mockReturnValue({
      repositories: [],
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: [],
      loading: false,
      error: null
    });

    mockUseToggleStar.mockReturnValue({
      toggleStar: mockToggleStar
    });
  });

  it('should provide initial context values', () => {
    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('all-repos-count')).toHaveTextContent('0');
    expect(screen.getByTestId('starred-repos-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should provide repositories from useFetchRepositories', async () => {
    mockUseFetchRepositories.mockReturnValue({
      repositories: mockRepositories,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('all-repos-count')).toHaveTextContent('2');
    });
  });

  it('should provide starred repositories from useStarredRepositories', async () => {
    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: mockStarredRepositories,
      loading: false,
      error: null
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('starred-repos-count')).toHaveTextContent('1');
    });
  });

  it('should show loading state when repositories are loading', () => {
    mockUseFetchRepositories.mockReturnValue({
      repositories: [],
      loading: true,
      error: null,
      refetch: jest.fn()
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should show loading state when starred repositories are loading', () => {
    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: [],
      loading: true,
      error: null
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should show error state when repositories fetch fails', () => {
    mockUseFetchRepositories.mockReturnValue({
      repositories: [],
      loading: false,
      error: 'Failed to fetch',
      refetch: jest.fn()
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch repositories. Please try again later.');
  });

  it('should show error state when starred repositories fetch fails', () => {
    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: [],
      loading: false,
      error: 'Failed to fetch starred'
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch repositories. Please try again later.');
  });

  it('should call toggleStar when toggle star button is clicked', async () => {
    mockUseFetchRepositories.mockReturnValue({
      repositories: mockRepositories,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    const toggleButton = screen.getByTestId('toggle-star');
    await act(async () => {
      toggleButton.click();
    });

    expect(mockToggleStar).toHaveBeenCalledWith(mockRepositories[0]);
  });

  it('should update starred repositories when useToggleStar is called with update function', () => {
    let capturedUpdateStarredRepos: ((repos: Repository[]) => void) | undefined;

    mockUseToggleStar.mockImplementation((updateStarredRepos) => {
      capturedUpdateStarredRepos = updateStarredRepos;
      return { toggleStar: mockToggleStar };
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    // Simulate updating starred repositories
    act(() => {
      capturedUpdateStarredRepos?.(mockStarredRepositories);
    });

    expect(screen.getByTestId('starred-repos-count')).toHaveTextContent('1');
  });

  it('should update all repositories when useToggleStar is called with updater function', async () => {
    let capturedUpdateAllRepos: ((updater: (repos: Repository[]) => Repository[]) => void) | undefined;

    mockUseFetchRepositories.mockReturnValue({
      repositories: mockRepositories,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    mockUseToggleStar.mockImplementation((updateStarredRepos, updateAllRepos) => {
      capturedUpdateAllRepos = updateAllRepos;
      return { toggleStar: mockToggleStar };
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('all-repos-count')).toHaveTextContent('2');
    });

    // Simulate updating all repositories
    act(() => {
      capturedUpdateAllRepos?.((repos) => [
        ...repos,
        {
          id: 3,
          name: 'new-repo',
          full_name: 'user/new-repo',
          description: 'New repository',
          html_url: 'https://github.com/user/new-repo',
          stargazers_count: 50,
          language: 'Python',
          created_at: '2023-01-01T00:00:00Z',
          owner: {
            login: 'user',
          },
          isStarred: false
        }
      ]);
    });

    expect(screen.getByTestId('all-repos-count')).toHaveTextContent('3');
  });

  it('should handle empty repositories arrays', () => {
    mockUseFetchRepositories.mockReturnValue({
      repositories: [],
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: [],
      loading: false,
      error: null
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('all-repos-count')).toHaveTextContent('0');
    expect(screen.getByTestId('starred-repos-count')).toHaveTextContent('0');
  });

  it('should not update repositories when initial repositories is empty', async () => {
    // Start with empty repositories
    mockUseFetchRepositories.mockReturnValue({
      repositories: [],
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    const { rerender } = render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('all-repos-count')).toHaveTextContent('0');

    // Update to return repositories but still empty
    mockUseFetchRepositories.mockReturnValue({
      repositories: [],
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    rerender(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('all-repos-count')).toHaveTextContent('0');
  });

  it('should not update starred repositories when initial starred repositories is empty', async () => {
    // Start with empty starred repositories
    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: [],
      loading: false,
      error: null
    });

    const { rerender } = render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('starred-repos-count')).toHaveTextContent('0');

    // Update to return starred repositories but still empty
    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: [],
      loading: false,
      error: null
    });

    rerender(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('starred-repos-count')).toHaveTextContent('0');
  });

  it('should handle both loading and error states simultaneously', () => {
    mockUseFetchRepositories.mockReturnValue({
      repositories: [],
      loading: true,
      error: 'Fetch error',
      refetch: jest.fn()
    });

    mockUseStarredRepositories.mockReturnValue({
      starredRepositories: [],
      loading: true,
      error: 'Starred error'
    });

    render(
      <RepositoriesProvider>
        <TestComponent />
      </RepositoriesProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch repositories. Please try again later.');
  });
});

import { renderHook, waitFor } from '@testing-library/react';
import { useFetchRepositories } from '../useRepositories';
import { githubService } from '@/services';
import type { Repository } from '@/types';

// Mock the github service
jest.mock('@/services');
const mockGithubService = githubService as jest.Mocked<typeof githubService>;

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('useFetchRepositories', () => {
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
        login: 'user'
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
      created_at: '2023-01-02T00:00:00Z',
      owner: {
        login: 'user',
      },
      isStarred: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('should fetch repositories successfully on mount', async () => {
    mockGithubService.getTrendingRepositories.mockResolvedValue(mockRepositories);

    const { result } = renderHook(() => useFetchRepositories());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual(mockRepositories);
    expect(result.current.error).toBeNull();
    expect(mockGithubService.getTrendingRepositories).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch repositories';
    mockGithubService.getTrendingRepositories.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchRepositories());

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch repositories. Please try again later.');
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error fetching repositories:',
      expect.any(Error)
    );
  });

  it('should handle network errors', async () => {
    mockGithubService.getTrendingRepositories.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFetchRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch repositories. Please try again later.');
  });

  it('should allow manual refetch', async () => {
    mockGithubService.getTrendingRepositories.mockResolvedValue(mockRepositories);

    const { result } = renderHook(() => useFetchRepositories());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGithubService.getTrendingRepositories).toHaveBeenCalledTimes(1);

    // Trigger refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGithubService.getTrendingRepositories).toHaveBeenCalledTimes(2);
  });

  it('should handle refetch errors', async () => {
    // First call succeeds
    mockGithubService.getTrendingRepositories.mockResolvedValueOnce(mockRepositories);
    // Second call fails
    mockGithubService.getTrendingRepositories.mockRejectedValueOnce(new Error('Refetch error'));

    const { result } = renderHook(() => useFetchRepositories());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual(mockRepositories);
    expect(result.current.error).toBeNull();

    // Trigger refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch repositories. Please try again later.');
  });

  it('should handle empty repository response', async () => {
    mockGithubService.getTrendingRepositories.mockResolvedValue([]);

    const { result } = renderHook(() => useFetchRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should maintain loading state during transitions', async () => {
    let resolvePromise: (value: Repository[]) => void;
    const promise = new Promise<Repository[]>((resolve) => {
      resolvePromise = resolve;
    });
    mockGithubService.getTrendingRepositories.mockReturnValue(promise);

    const { result } = renderHook(() => useFetchRepositories());

    // Should be loading initially
    expect(result.current.loading).toBe(true);

    // Resolve the promise
    resolvePromise!(mockRepositories);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.repositories).toEqual(mockRepositories);
  });
});

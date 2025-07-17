import { renderHook, waitFor } from '@testing-library/react';
import { useStarredRepositories } from '../useStarredRepositories';
import { localStorageService } from '@/services';
import type { Repository } from '@/types';

// Mock the localStorage service
jest.mock('@/services');
const mockLocalStorageService = localStorageService as jest.Mocked<typeof localStorageService>;

describe('useStarredRepositories', () => {
  const mockStarredRepositories: Repository[] = [
    {
      id: 1,
      name: 'starred-repo-1',
      full_name: 'user/starred-repo-1',
      description: 'Starred repository 1',
      html_url: 'https://github.com/user/starred-repo-1',
      stargazers_count: 150,
      language: 'TypeScript',
      created_at: '2023-01-01T00:00:00Z',
      owner: {
        login: 'user',
      },
      isStarred: true
    },
    {
      id: 2,
      name: 'starred-repo-2',
      full_name: 'user/starred-repo-2',
      description: 'Starred repository 2',
      html_url: 'https://github.com/user/starred-repo-2',
      stargazers_count: 250,
      language: 'JavaScript',
      created_at: '2023-01-01T00:00:00Z',
      owner: {
        login: 'user',
      },
      isStarred: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load starred repositories successfully on mount', async () => {
    mockLocalStorageService.getStarredRepositories.mockReturnValue(mockStarredRepositories);

    const { result } = renderHook(() => useStarredRepositories());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.starredRepositories).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the transition to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.starredRepositories).toEqual(mockStarredRepositories);
    expect(result.current.error).toBeNull();
    expect(mockLocalStorageService.getStarredRepositories).toHaveBeenCalledTimes(1);
  });

  it('should handle empty starred repositories', async () => {
    mockLocalStorageService.getStarredRepositories.mockReturnValue([]);

    const { result } = renderHook(() => useStarredRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.starredRepositories).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should handle localStorage service errors gracefully', async () => {
    // Mock the service to return empty array when error occurs
    mockLocalStorageService.getStarredRepositories.mockReturnValue([]);

    const { result } = renderHook(() => useStarredRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.starredRepositories).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should maintain loading state during transition', async () => {
    mockLocalStorageService.getStarredRepositories.mockReturnValue(mockStarredRepositories);

    const { result } = renderHook(() => useStarredRepositories());

    // Should be loading initially
    expect(result.current.loading).toBe(true);
    expect(result.current.starredRepositories).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.starredRepositories).toEqual(mockStarredRepositories);
  });

  it('should only call getStarredRepositories once on mount', async () => {
    mockLocalStorageService.getStarredRepositories.mockReturnValue(mockStarredRepositories);

    const { result, rerender } = renderHook(() => useStarredRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Rerender the hook
    rerender();

    // Should still only be called once
    expect(mockLocalStorageService.getStarredRepositories).toHaveBeenCalledTimes(1);
  });

  it('should handle single starred repository', async () => {
    const singleRepo = [mockStarredRepositories[0]];
    mockLocalStorageService.getStarredRepositories.mockReturnValue(singleRepo);

    const { result } = renderHook(() => useStarredRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.starredRepositories).toEqual(singleRepo);
    expect(result.current.starredRepositories).toHaveLength(1);
  });

  it('should handle large number of starred repositories', async () => {
    const manyRepos = Array.from({ length: 100 }, (_, index) => ({
      ...mockStarredRepositories[0],
      id: index + 1,
      name: `starred-repo-${index + 1}`,
      full_name: `user/starred-repo-${index + 1}`,
    }));

    mockLocalStorageService.getStarredRepositories.mockReturnValue(manyRepos);

    const { result } = renderHook(() => useStarredRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.starredRepositories).toEqual(manyRepos);
    expect(result.current.starredRepositories).toHaveLength(100);
  });

  it('should clear error state on successful load', async () => {
    mockLocalStorageService.getStarredRepositories.mockReturnValue(mockStarredRepositories);

    const { result } = renderHook(() => useStarredRepositories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });
});

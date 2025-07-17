import { renderHook, act } from '@testing-library/react';
import { useToggleStar } from '../useToggleStar';
import { localStorageService } from '@/services';
import type { Repository } from '@/types';

// Mock the localStorage service
jest.mock('@/services');
const mockLocalStorageService = localStorageService as jest.Mocked<typeof localStorageService>;

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('useToggleStar', () => {
  const mockRepository: Repository = {
    id: 1,
    name: 'test-repo',
    full_name: 'user/test-repo',
    description: 'Test repository',
    html_url: 'https://github.com/user/test-repo',
    stargazers_count: 100,
    language: 'TypeScript',
    created_at: '2023-01-01T00:00:00Z',
    owner: {
      login: 'user',
    },
    isStarred: false
  };

  const mockStarredRepository: Repository = {
    ...mockRepository,
    isStarred: true
  };

  const mockUpdateStarredRepositories = jest.fn();
  const mockUpdateAllRepositories = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('toggleStar', () => {
    it('should star an unstarred repository', async () => {
      const updatedStarredRepos = [mockStarredRepository];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(false);
      mockLocalStorageService.addStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      let toggleResult: Repository[];
      await act(async () => {
        toggleResult = await result.current.toggleStar(mockRepository);
      });

      expect(mockLocalStorageService.isRepositoryStarred).toHaveBeenCalledWith(1);
      expect(mockLocalStorageService.addStarredRepository).toHaveBeenCalledWith(mockRepository);
      expect(mockUpdateStarredRepositories).toHaveBeenCalledWith(updatedStarredRepos);
      expect(mockUpdateAllRepositories).toHaveBeenCalledWith(expect.any(Function));
      expect(toggleResult!).toEqual(updatedStarredRepos);
    });

    it('should unstar a starred repository', async () => {
      const updatedStarredRepos: Repository[] = [];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(true);
      mockLocalStorageService.removeStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      let toggleResult: Repository[];
      await act(async () => {
        toggleResult = await result.current.toggleStar(mockStarredRepository);
      });

      expect(mockLocalStorageService.isRepositoryStarred).toHaveBeenCalledWith(1);
      expect(mockLocalStorageService.removeStarredRepository).toHaveBeenCalledWith(1);
      expect(mockUpdateStarredRepositories).toHaveBeenCalledWith(updatedStarredRepos);
      expect(mockUpdateAllRepositories).toHaveBeenCalledWith(expect.any(Function));
      expect(toggleResult!).toEqual(updatedStarredRepos);
    });

    it('should work without update functions', async () => {
      const updatedStarredRepos = [mockStarredRepository];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(false);
      mockLocalStorageService.addStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() => useToggleStar());

      let toggleResult: Repository[];
      await act(async () => {
        toggleResult = await result.current.toggleStar(mockRepository);
      });

      expect(mockLocalStorageService.addStarredRepository).toHaveBeenCalledWith(mockRepository);
      expect(toggleResult!).toEqual(updatedStarredRepos);
      expect(mockUpdateStarredRepositories).not.toHaveBeenCalled();
      expect(mockUpdateAllRepositories).not.toHaveBeenCalled();
    });

    it('should work with only updateStarredRepositories function', async () => {
      const updatedStarredRepos = [mockStarredRepository];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(false);
      mockLocalStorageService.addStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories)
      );

      await act(async () => {
        await result.current.toggleStar(mockRepository);
      });

      expect(mockUpdateStarredRepositories).toHaveBeenCalledWith(updatedStarredRepos);
      expect(mockUpdateAllRepositories).not.toHaveBeenCalled();
    });

    it('should work with only updateAllRepositories function', async () => {
      const updatedStarredRepos = [mockStarredRepository];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(false);
      mockLocalStorageService.addStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() =>
        useToggleStar(undefined, mockUpdateAllRepositories)
      );

      await act(async () => {
        await result.current.toggleStar(mockRepository);
      });

      expect(mockUpdateStarredRepositories).not.toHaveBeenCalled();
      expect(mockUpdateAllRepositories).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should correctly update all repositories when starring', async () => {
      const updatedStarredRepos = [mockStarredRepository];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(false);
      mockLocalStorageService.addStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      await act(async () => {
        await result.current.toggleStar(mockRepository);
      });

      // Get the updater function that was passed to mockUpdateAllRepositories
      const updaterFunction = mockUpdateAllRepositories.mock.calls[0][0];
      const currentRepos = [mockRepository, { ...mockRepository, id: 2 }];
      const updatedRepos = updaterFunction(currentRepos);

      expect(updatedRepos).toEqual([
        { ...mockRepository, isStarred: true },
        { ...mockRepository, id: 2 }
      ]);
    });

    it('should correctly update all repositories when unstarring', async () => {
      const updatedStarredRepos: Repository[] = [];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(true);
      mockLocalStorageService.removeStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      await act(async () => {
        await result.current.toggleStar(mockStarredRepository);
      });

      // Get the updater function that was passed to mockUpdateAllRepositories
      const updaterFunction = mockUpdateAllRepositories.mock.calls[0][0];
      const currentRepos = [mockStarredRepository, { ...mockStarredRepository, id: 2 }];
      const updatedRepos = updaterFunction(currentRepos);

      expect(updatedRepos).toEqual([
        { ...mockStarredRepository, isStarred: false },
        { ...mockStarredRepository, id: 2 }
      ]);
    });

    it('should handle errors from localStorage service', async () => {
      const error = new Error('localStorage error');
      mockLocalStorageService.isRepositoryStarred.mockImplementation(() => {
        throw error;
      });

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      await act(async () => {
        await expect(result.current.toggleStar(mockRepository)).rejects.toThrow('localStorage error');
      });

      expect(mockConsoleError).toHaveBeenCalledWith('Error toggling star status:', error);
    });

    it('should handle errors from addStarredRepository', async () => {
      const error = new Error('Add starred repository error');
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(false);
      mockLocalStorageService.addStarredRepository.mockImplementation(() => {
        throw error;
      });

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      await act(async () => {
        await expect(result.current.toggleStar(mockRepository)).rejects.toThrow('Add starred repository error');
      });

      expect(mockConsoleError).toHaveBeenCalledWith('Error toggling star status:', error);
    });

    it('should handle errors from removeStarredRepository', async () => {
      const error = new Error('Remove starred repository error');
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(true);
      mockLocalStorageService.removeStarredRepository.mockImplementation(() => {
        throw error;
      });

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      await act(async () => {
        await expect(result.current.toggleStar(mockStarredRepository)).rejects.toThrow('Remove starred repository error');
      });

      expect(mockConsoleError).toHaveBeenCalledWith('Error toggling star status:', error);
    });

    it('should handle multiple rapid toggle calls', async () => {
      const updatedStarredRepos = [mockStarredRepository];
      mockLocalStorageService.isRepositoryStarred.mockReturnValue(false);
      mockLocalStorageService.addStarredRepository.mockReturnValue(updatedStarredRepos);

      const { result } = renderHook(() =>
        useToggleStar(mockUpdateStarredRepositories, mockUpdateAllRepositories)
      );

      await act(async () => {
        const promises = [
          result.current.toggleStar(mockRepository),
          result.current.toggleStar(mockRepository),
          result.current.toggleStar(mockRepository)
        ];
        await Promise.all(promises);
      });

      expect(mockLocalStorageService.addStarredRepository).toHaveBeenCalledTimes(3);
      expect(mockUpdateStarredRepositories).toHaveBeenCalledTimes(3);
    });
  });
});

import { localStorageService } from '../localStorage.service';
import { STARRED_REPOS_KEY } from '@/constants';
import type { Repository } from '@/types';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('localStorageService', () => {
  const mockRepository: Repository =  {
          id: 1,
          name: 'test-repo',
          created_at: '2023-01-01T00:00:00Z',
          full_name: 'user/test-repo',
          description: 'Test repository',
          html_url: 'https://github.com/user/test-repo',
          stargazers_count: 100,
          language: 'TypeScript',
          owner: {
            login: 'user'
          },
          isStarred: false
        };

  const mockStarredRepository: Repository = {
    ...mockRepository,
    isStarred: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('getStarredRepositories', () => {
    it('should return starred repositories from localStorage', () => {
      const mockRepos = [mockStarredRepository];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRepos));

      const result = localStorageService.getStarredRepositories();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STARRED_REPOS_KEY);
      expect(result).toEqual(mockRepos);
    });

    it('should return empty array when no data in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = localStorageService.getStarredRepositories();

      expect(result).toEqual([]);
    });

    it('should return empty array when localStorage data is invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const result = localStorageService.getStarredRepositories();

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error getting starred repositories from local storage:',
        expect.any(SyntaxError)
      );
    });

    it('should handle localStorage access errors', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage access denied');
      });

      const result = localStorageService.getStarredRepositories();

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error getting starred repositories from local storage:',
        expect.any(Error)
      );
    });
  });

  describe('saveStarredRepositories', () => {
    it('should save repositories to localStorage', () => {
      const mockRepos = [mockStarredRepository];

      localStorageService.saveStarredRepositories(mockRepos);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STARRED_REPOS_KEY,
        JSON.stringify(mockRepos)
      );
    });

    it('should handle localStorage save errors', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      localStorageService.saveStarredRepositories([mockStarredRepository]);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error saving starred repositories to local storage:',
        expect.any(Error)
      );
    });
  });

  describe('addStarredRepository', () => {
    it('should add a new repository to starred list', () => {
      mockLocalStorage.getItem.mockReturnValue('[]');

      const result = localStorageService.addStarredRepository(mockRepository);

      expect(result).toEqual([mockStarredRepository]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STARRED_REPOS_KEY,
        JSON.stringify([mockStarredRepository])
      );
    });

    it('should not add duplicate repository', () => {
      const existingRepos = [mockStarredRepository];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingRepos));

      const result = localStorageService.addStarredRepository(mockRepository);

      expect(result).toEqual(existingRepos);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle errors and return current starred repositories', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = localStorageService.addStarredRepository(mockRepository);

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error adding starred repository:',
        expect.any(Error)
      );
    });
  });

  describe('removeStarredRepository', () => {
    it('should remove repository from starred list', () => {
      const existingRepos = [mockStarredRepository, { ...mockStarredRepository, id: 2 }];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingRepos));

      const result = localStorageService.removeStarredRepository(1);

      expect(result).toEqual([{ ...mockStarredRepository, id: 2 }]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STARRED_REPOS_KEY,
        JSON.stringify([{ ...mockStarredRepository, id: 2 }])
      );
    });

    it('should handle removal of non-existent repository', () => {
      const existingRepos = [mockStarredRepository];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingRepos));

      const result = localStorageService.removeStarredRepository(999);

      expect(result).toEqual(existingRepos);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STARRED_REPOS_KEY,
        JSON.stringify(existingRepos)
      );
    });

    it('should handle errors and return current starred repositories', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = localStorageService.removeStarredRepository(1);

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error removing starred repository:',
        expect.any(Error)
      );
    });
  });

  describe('isRepositoryStarred', () => {
    it('should return true for starred repository', () => {
      const existingRepos = [mockStarredRepository];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingRepos));

      const result = localStorageService.isRepositoryStarred(1);

      expect(result).toBe(true);
    });

    it('should return false for non-starred repository', () => {
      const existingRepos = [mockStarredRepository];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingRepos));

      const result = localStorageService.isRepositoryStarred(999);

      expect(result).toBe(false);
    });

    it('should return false when no starred repositories exist', () => {
      mockLocalStorage.getItem.mockReturnValue('[]');

      const result = localStorageService.isRepositoryStarred(1);

      expect(result).toBe(false);
    });

    it('should handle errors and return false', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = localStorageService.isRepositoryStarred(1);

      expect(result).toBe(false);
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error checking if repository is starred:',
        expect.any(Error)
      );
    });
  });
});

import { githubService } from '../github.service';
import { apiService } from '../api.service';
import { BASE_URL } from '@/constants';
import type { Repository } from '@/types';

// Mock the api service
jest.mock('../api.service');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('githubService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('getTrendingRepositories', () => {
    it('should fetch trending repositories successfully', async () => {
      const mockRepositories: Repository[] = [
        {
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
        }
      ];

      mockApiService.get.mockResolvedValue({ items: mockRepositories });

      const result = await githubService.getTrendingRepositories();

      expect(result).toEqual(mockRepositories);
      expect(mockApiService.get).toHaveBeenCalledWith(
        `${BASE_URL}/search/repositories`,
        expect.objectContaining({
          q: expect.stringMatching(/^created:>\d{4}-\d{2}-\d{2}$/),
          sort: 'stars',
          order: 'desc',
          per_page: '30'
        })
      );
    });

    it('should use correct date format for query', async () => {
      const mockRepositories: Repository[] = [];
      mockApiService.get.mockResolvedValue({ items: mockRepositories });

      await githubService.getTrendingRepositories();

      const callArgs = mockApiService.get.mock.calls[0][1];
      const dateQuery = callArgs?.q as string;

      // Extract date from query
      const dateMatch = dateQuery.match(/created:>(\d{4}-\d{2}-\d{2})/);
      expect(dateMatch).toBeTruthy();

      if (dateMatch) {
        const queryDate = new Date(dateMatch[1]);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - 7);

        // Check if the date is within a reasonable range (same day)
        const timeDiff = Math.abs(queryDate.getTime() - expectedDate.getTime());
        expect(timeDiff).toBeLessThan(24 * 60 * 60 * 1000); // Less than 24 hours
      }
    });

    it('should handle API errors and rethrow them', async () => {
      const mockError = new Error('API Error');
      mockApiService.get.mockRejectedValue(mockError);

      await expect(githubService.getTrendingRepositories()).rejects.toThrow('API Error');
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching trending repositories:', mockError);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockApiService.get.mockRejectedValue(networkError);

      await expect(githubService.getTrendingRepositories()).rejects.toThrow('Network Error');
      expect(mockConsoleError).toHaveBeenCalledWith('Error fetching trending repositories:', networkError);
    });
  });
});

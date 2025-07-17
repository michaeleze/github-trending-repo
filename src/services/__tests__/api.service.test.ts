import { apiService } from '../api.service';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('get', () => {
    it('should make successful GET request without parameters', async () => {
      const mockData = { message: 'success' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.get('https://api.example.com/data');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data');
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should make successful GET request with parameters', async () => {
      const mockData = { items: [] };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const params = { q: 'test', sort: 'stars', order: 'desc' };
      const result = await apiService.get('https://api.example.com/search', params);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/search?q=test&sort=stars&order=desc'
      );
      expect(result).toEqual(mockData);
    });

    it('should handle empty parameters object', async () => {
      const mockData = { data: 'test' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.get('https://api.example.com/data', {});

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data?');
      expect(result).toEqual(mockData);
    });

    it('should handle parameters with special characters', async () => {
      const mockData = { results: [] };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const params = { q: 'test query with spaces', filter: 'type:repo' };
      const result = await apiService.get('https://api.example.com/search', params);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/search?q=test+query+with+spaces&filter=type%3Arepo'
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error for HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.get('https://api.example.com/notfound'))
        .rejects.toThrow('HTTP error! Status: 404');

      expect(mockConsoleError).toHaveBeenCalledWith(
        'API request failed:',
        expect.any(Error)
      );
    });

    it('should handle different HTTP error status codes', async () => {
      const testCases = [400, 401, 403, 500, 502, 503];

      for (const status of testCases) {
        const mockResponse = {
          ok: false,
          status,
        };
        mockFetch.mockResolvedValue(mockResponse);

        await expect(apiService.get('https://api.example.com/error'))
          .rejects.toThrow(`HTTP error! Status: ${status}`);
      }
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(apiService.get('https://api.example.com/data'))
        .rejects.toThrow('Network error');

      expect(mockConsoleError).toHaveBeenCalledWith(
        'API request failed:',
        networkError
      );
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.get('https://api.example.com/data'))
        .rejects.toThrow('Invalid JSON');

      expect(mockConsoleError).toHaveBeenCalledWith(
        'API request failed:',
        expect.any(Error)
      );
    });

    it('should handle fetch timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockFetch.mockRejectedValue(timeoutError);

      await expect(apiService.get('https://api.example.com/slow'))
        .rejects.toThrow('Request timeout');

      expect(mockConsoleError).toHaveBeenCalledWith(
        'API request failed:',
        timeoutError
      );
    });

    it('should preserve type information in response', async () => {
      interface TestResponse {
        id: number;
        name: string;
      }

      const mockData: TestResponse = { id: 1, name: 'test' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.get<TestResponse>('https://api.example.com/typed');

      expect(result).toEqual(mockData);
      expect(result.id).toBe(1);
      expect(result.name).toBe('test');
    });
  });
});
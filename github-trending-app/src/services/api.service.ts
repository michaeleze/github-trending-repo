/**
 * Generic API service for making HTTP requests
 */
export const apiService = {
  /**
   * Make a GET request to the specified URL
   * @param url - The URL to fetch from
   * @param params - Optional query parameters
   * @returns Promise with the response data
   */
  get: async <T>(url: string, params?: Record<string, string>): Promise<T> => {
    try {
      // Construct URL with query parameters if provided
      const searchParams = new URLSearchParams(params);
      const queryString = params ? `?${searchParams.toString()}` : '';

      const response = await fetch(`${url}${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

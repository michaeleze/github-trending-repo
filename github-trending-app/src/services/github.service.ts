import type { Repository } from '@/types';
import { apiService } from './api.service';
import { BASE_URL } from '@/constants';

/**
 * Service for interacting with GitHub API
 */
export const githubService = {
  /**
   * Fetch trending repositories from the past week
   * @returns Promise with Repository array
   */
  getTrendingRepositories: async (): Promise<Repository[]> => {
    try {
      // Get date for one week ago
      const date = new Date();
      date.setDate(date.getDate() - 7);
      const dateString = date.toISOString().split('T')[0];

      // Query for repositories created in the last week, sorted by stars
      const response = await apiService.get<{ items: Repository[] }>(
        `${BASE_URL}/search/repositories`,
        {
          q: `created:>${dateString}`,
          sort: 'stars',
          order: 'desc',
          per_page: '30'
        }
      );

      return response.items;
    } catch (error) {
      console.error('Error fetching trending repositories:', error);
      throw error;
    }
  }
};

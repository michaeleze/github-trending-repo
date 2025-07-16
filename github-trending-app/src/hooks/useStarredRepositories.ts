import { useState, useEffect } from 'react';
import type { Repository } from '@/types';
import { localStorageService } from '@/services';

/**
 * Custom hook for fetching starred repositories
 */
export const useStarredRepositories = () => {
  const [starredRepositories, setStarredRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      // Get starred repositories from local storage
      const starredRepos = localStorageService.getStarredRepositories();
      setStarredRepositories(starredRepos);
      setError(null);
    } catch (err) {
      console.error('Error fetching starred repositories:', err);
      setError('Failed to fetch starred repositories.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { starredRepositories, loading, error };
};

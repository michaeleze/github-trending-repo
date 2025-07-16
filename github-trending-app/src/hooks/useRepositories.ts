import { useState, useEffect } from 'react';
import type { Repository } from '@/types';
import { githubService, localStorageService } from '@/services';

/**
 * Custom hook for fetching trending repositories
 */
export const useRepositories = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        // Fetch trending repositories from GitHub API
        const repos = await githubService.getTrendingRepositories();

        // Get starred repositories from local storage
        const starredRepoIds = localStorageService.getStarredRepositories()
          .map(repo => repo.id);

        // Mark repositories as starred if they are in local storage
        const reposWithStarStatus = repos.map(repo => ({
          ...repo,
          isStarred: starredRepoIds.includes(repo.id)
        }));

        setRepositories(reposWithStarStatus);
        setError(null);
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError('Failed to fetch repositories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();

    // Refresh repositories when window gains focus
    const handleFocus = () => {
      fetchRepositories();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { repositories, loading, error };
};

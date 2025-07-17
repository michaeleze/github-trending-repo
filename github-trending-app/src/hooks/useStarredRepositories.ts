import { useState, useEffect, useTransition } from 'react';
import type { Repository } from '@/types';
import { localStorageService } from '@/services';

/**
 * Custom hook for fetching starred repositories using React 19 patterns
 */
export const useStarredRepositories = () => {
  const [starredRepositories, setStarredRepositories] = useState<Repository[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use transition for non-blocking state updates
    startTransition(() => {
        const starredRepos = localStorageService.getStarredRepositories();
        setStarredRepositories(starredRepos);
        setError(null);
    });
  }, []);

  return {
    starredRepositories,
    loading: isPending,
    error
  };
};

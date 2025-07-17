import { useState, useEffect, useActionState, useTransition } from 'react';
import type { Repository } from '@/types';
import { githubService } from '@/services';

export const useFetchRepositories = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isPending, startTransition] = useTransition();

  const [error, fetchAction] = useActionState(
    async () => {
      try {
        // Fetch trending repositories from GitHub API
        const repos = await githubService.getTrendingRepositories();
        setRepositories(repos);
      } catch (err) {
        console.error('Error fetching repositories:', err);
        return 'Failed to fetch repositories. Please try again later.';
      }
    },
    null
  );

  // Fetch repositories on mount and window focus
  useEffect(() => {
    startTransition(() => {
      fetchAction();
    });
  }, [fetchAction, startTransition]);

  return {
    repositories,
    loading: isPending,
    error,
    refetch: fetchAction
  };
};

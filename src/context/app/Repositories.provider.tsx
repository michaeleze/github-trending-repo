import type {
  RepositoriesProviderProps,
  RepositoriesContextType,
  RepositoryActions
} from '@/types';
import {
  useStarredRepositories,
} from '@/hooks';
import { RepositoriesContext } from './index';
import { useState, useEffect } from 'react';
import type { Repository } from '@/types';
import { toggleRepositoryStar } from '@/utils';
import { useFetchRepositories } from '@/hooks';

/**
 * Provider component for the Repositories context
 * Manages repository data, loading states, and actions
 */
export const RepositoriesProvider = ({ children }: RepositoriesProviderProps) => {
  const { repositories: initialRepositories, loading: reposLoading, error: reposError } = useFetchRepositories();
  const { starredRepositories: initialStarredRepositories, loading: starredLoading, error: starredError } = useStarredRepositories();

  // Use state to manage repositories that can be updated by the toggleStar function
  const [allRepositories, setAllRepositories] = useState<Repository[]>(initialRepositories);
  const [starredRepositories, setStarredRepositories] = useState<Repository[]>(initialStarredRepositories);

  // Update repositories when fetched data changes using useEffect
  useEffect(() => {
    if (initialRepositories.length > 0) {
      setAllRepositories(initialRepositories);
    }
  }, [initialRepositories]);

  useEffect(() => {
    if (initialStarredRepositories.length > 0) {
      setStarredRepositories(initialStarredRepositories);
    }
  }, [initialStarredRepositories]);

  const loading = reposLoading || starredLoading;
  const error = reposError || starredError ? 'Failed to fetch repositories. Please try again later.' : null;

  // Toggle star function
  const toggleStar = async (repository: Repository) => {
    await toggleRepositoryStar(
      repository,
      setStarredRepositories,
      setAllRepositories
    );
  };


  // Create context value
  const contextValue: RepositoriesContextType & RepositoryActions = {
    allRepositories,
    starredRepositories,
    loading,
    error,
    toggleStar,
  };

  return (
    <RepositoriesContext.Provider value={contextValue}>
      {children}
    </RepositoriesContext.Provider>
  );
};

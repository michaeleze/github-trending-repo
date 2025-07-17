import type {
  RepositoriesProviderProps,
  RepositoriesContextType,
  RepositoryActions
} from '@/types';
import {
  useFetchRepositories,
  useStarredRepositories,
  useToggleStar
} from '@/hooks';
import { RepositoriesContext } from './index';
import { useState, useEffect } from 'react';
import type { Repository } from '@/types';

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

  // Use the toggleStar hook with the update functions
  const { toggleStar } = useToggleStar(
    // Update starred repositories
    (updatedStarredRepos) => {
      setStarredRepositories(updatedStarredRepos);
    },
    // Update all repositories
    (updater) => {
      setAllRepositories(updater(allRepositories));
    }
  );


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

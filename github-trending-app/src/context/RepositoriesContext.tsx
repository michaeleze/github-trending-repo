import { useState, useEffect } from 'react';
import type {
  Repository,
  RepositoriesProviderProps,
  LoadingState,
} from '@/types';
import {
  useRepositories as useFetchRepositories,
  useStarredRepositories,
  useToggleStar,
  useSortRepositories
 } from '@/hooks';
import { RepositoriesContext } from '@/context';

export const RepositoriesProvider = ({ children }: RepositoriesProviderProps) => {
  // State for repositories
  const [allRepositories, setAllRepositories] = useState<Repository[]>([]);
  const [starredRepositories, setStarredRepositories] = useState<Repository[]>([]);

  // Use custom hooks for fetching data
  const { repositories, loading: reposLoading, error: reposError } = useFetchRepositories();
  const {
    starredRepositories: starredRepos,
    loading: starredLoading,
    error: starredError
  } = useStarredRepositories();

  // Update state when repositories or starred repositories are fetched
  useEffect(() => {
    if (repositories) {
      setAllRepositories(repositories);
    }
  }, [repositories]);

  useEffect(() => {
    if (starredRepos) {
      setStarredRepositories(starredRepos);
    }
  }, [starredRepos]);

  // Create loading state
  const loadingState: LoadingState = {
    loading: reposLoading || starredLoading,
    error: reposError || starredError ? 'Failed to fetch repositories. Please try again later.' : null
  };

  // Use custom hook for toggling star status
  const toggleStar = useToggleStar(
    (reposUpdater) => {
      if (typeof reposUpdater === 'function') {
        setAllRepositories(reposUpdater(allRepositories));
      } else {
        setAllRepositories(reposUpdater);
      }
    },
    setStarredRepositories
  );

  // Use custom hook for sorting repositories
  const sortRepositoriesFn = useSortRepositories(allRepositories, setAllRepositories);

  return (
    <RepositoriesContext
      value={{
        allRepositories,
        starredRepositories,
        loading: loadingState.loading,
        error: loadingState.error,
        toggleStar,
        sortRepositories: sortRepositoriesFn
      }}
    >
      {children}
    </RepositoriesContext>
  );
};

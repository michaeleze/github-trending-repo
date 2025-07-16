import type { Repository } from '@/types';
import { localStorageService } from '@/services';

/**
 * Custom hook for toggling star status of a repository
 */
export const useToggleStar = (
  updateRepositories: (repos: Repository[]) => void,
  updateStarredRepositories: (repos: Repository[]) => void
) => {
  const toggleStar = async (repository: Repository) => {
    try {
      const isCurrentlyStarred = localStorageService.isRepositoryStarred(repository.id);
      let updatedStarredRepos: Repository[];

      if (isCurrentlyStarred) {
        // Remove from starred repositories
        updatedStarredRepos = localStorageService.removeStarredRepository(repository.id);
      } else {
        // Add to starred repositories
        updatedStarredRepos = localStorageService.addStarredRepository(repository);
      }

      // Update the starred repositories state
      updateStarredRepositories(updatedStarredRepos);

      // Update the repositories state with the new star status
      updateRepositories(currentRepos =>
        currentRepos.map(repo => {
          if (repo.id === repository.id) {
            return { ...repo, isStarred: !repo.isStarred };
          }
          return repo;
        })
      );

      return updatedStarredRepos;
    } catch (error) {
      console.error('Error toggling star status:', error);
      throw error;
    }
  };

  return toggleStar;
};

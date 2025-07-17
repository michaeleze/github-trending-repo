import type { Repository } from '@/types';
import { localStorageService } from '@/services';

/**
 * Custom hook for toggling star status of a repository
 * @param updateStarredRepositories - Function to update starred repositories state
 * @param updateAllRepositories - Function to update all repositories state
 */
export const useToggleStar = (
  updateStarredRepositories?: (repos: Repository[]) => void,
  updateAllRepositories?: (updater: (repos: Repository[]) => Repository[]) => void
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

      // Update the starred repositories state if the function is provided
      if (updateStarredRepositories) {
        updateStarredRepositories(updatedStarredRepos);
      }

      // Update the repositories state with the new star status if the function is provided
      if (updateAllRepositories) {
        updateAllRepositories(currentRepos =>
          currentRepos.map(repo =>
            repo.id === repository.id
              ? { ...repo, isStarred: !isCurrentlyStarred }
              : repo
          )
        );
      }

      return updatedStarredRepos;
    } catch (error) {
      console.error('Error toggling star status:', error);
      throw error;
    }
  };

  return { toggleStar };
};

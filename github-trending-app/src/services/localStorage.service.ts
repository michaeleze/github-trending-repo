import { STARRED_REPOS_KEY } from "@/constants";
import type { Repository } from "@/types";

/**
 * Service for handling local storage operations
 */
export const localStorageService = {
  /**
   * Get starred repositories from local storage
   * @returns Array of starred repositories
   */
  getStarredRepositories: (): Repository[] => {
    try {
      const storedRepos = localStorage.getItem(STARRED_REPOS_KEY);
      return storedRepos ? JSON.parse(storedRepos) : [];
    } catch (error) {
      console.error('Error getting starred repositories from local storage:', error);
      return [];
    }
  },

  /**
   * Save starred repositories to local storage
   * @param repositories - Array of repositories to save
   */
  saveStarredRepositories: (repositories: Repository[]): void => {
    try {
      localStorage.setItem(STARRED_REPOS_KEY, JSON.stringify(repositories));
    } catch (error) {
      console.error('Error saving starred repositories to local storage:', error);
    }
  },

  /**
   * Add a repository to starred repositories
   * @param repository - Repository to star
   * @returns Updated array of starred repositories
   */
  addStarredRepository: (repository: Repository): Repository[] => {
    try {
      const starredRepos = localStorageService.getStarredRepositories();
      // Check if repository is already starred
      if (!starredRepos.some(repo => repo.id === repository.id)) {
        const updatedRepos = [...starredRepos, { ...repository, isStarred: true }];
        localStorageService.saveStarredRepositories(updatedRepos);
        return updatedRepos;
      }
      return starredRepos;
    } catch (error) {
      console.error('Error adding starred repository:', error);
      return localStorageService.getStarredRepositories();
    }
  },

  /**
   * Remove a repository from starred repositories
   * @param repositoryId - ID of repository to unstar
   * @returns Updated array of starred repositories
   */
  removeStarredRepository: (repositoryId: number): Repository[] => {
    try {
      const starredRepos = localStorageService.getStarredRepositories();
      const updatedRepos = starredRepos.filter(repo => repo.id !== repositoryId);
      localStorageService.saveStarredRepositories(updatedRepos);
      return updatedRepos;
    } catch (error) {
      console.error('Error removing starred repository:', error);
      return localStorageService.getStarredRepositories();
    }
  },

  /**
   * Check if a repository is starred
   * @param repositoryId - ID of repository to check
   * @returns Boolean indicating if repository is starred
   */
  isRepositoryStarred: (repositoryId: number): boolean => {
    try {
      const starredRepos = localStorageService.getStarredRepositories();
      return starredRepos.some(repo => repo.id === repositoryId);
    } catch (error) {
      console.error('Error checking if repository is starred:', error);
      return false;
    }
  }
};

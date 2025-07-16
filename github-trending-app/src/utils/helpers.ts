import type { Repository, SortKey } from "@/types";

/**
 * Helper function to sort repositories by the given key
 */
export const sortByKey = (repositories: Repository[], key: SortKey): Repository[] => {
  return [...repositories].sort((a, b) => {
    if (key === 'language') {
      if (!a.language) return 1;
      if (!b.language) return -1;
      return a.language.localeCompare(b.language);
    } else {
      // Sort by stars (descending)
      return b.stargazers_count - a.stargazers_count;
    }
  });
};

import type { Repository } from "@/types";

/**
 * Format a number with a 'k' suffix for thousands
 * @param count The number to format
 * @returns Formatted string
 */
export const formatStarCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count;
};

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param text The string to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text?.substring(0, maxLength)}...`;
};

export const getFilteredRepositories = (
  repositories: Repository[],
  options: {
    searchTerm?: string;
    languageFilter?: string;
  } = {}
): Repository[] => {
  const { searchTerm, languageFilter } = options;
  let result = repositories;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    const searchedResult =  result.filter(repo =>
      repo.name.toLowerCase().includes(term) ||
      repo.description?.toLowerCase().includes(term) ||
      repo.owner.login.toLowerCase().includes(term)
    );
    result = searchedResult;
  }

  if (languageFilter && languageFilter !== 'all') {
    const filteredResult = result.filter(repo =>
      repo.language?.toLowerCase() === languageFilter.toLowerCase()
    );
     result = filteredResult;
  }

  return result;
};

/**
 * Format a number with a 'k' suffix for thousands
 * @param count The number to format
 * @returns Formatted string
 */
export const formatStarCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
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
  return `${text.substring(0, maxLength)}...`;
};
/**
 * Validates LangWatch API key format.
 * Accepts both new format (sk-lw-*) and legacy format (ey*).
 *
 * @param value - The API key to validate
 * @returns true if valid, error message if invalid
 *
 * @example
 * ```ts
 * const result = validateLangWatchKey('sk-lw-abc123');
 * // Returns: true
 * ```
 */
export const validateLangWatchKey = (value: string): true | string => {
  if (!value || value.trim().length === 0) {
    return "LangWatch API key is required";
  }
  if (!value.startsWith("sk-lw-") && !value.startsWith("ey")) {
    return 'LangWatch API key should start with "sk-lw-"';
  }
  return true;
};

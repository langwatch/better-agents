import { getAllCodingAssistants } from "../providers/coding-assistants/index.js";

/**
 * Utility class for coding assistant-related operations.
 */
export class CodingAssistantUtils {
  /**
   * Detects which coding assistants are installed on the system.
   * Uses each provider's own isAvailable() method for detection.
   *
   * @returns Promise resolving to a map of assistant IDs to installation status
   *
   * @example
   * ```ts
   * const installed = await CodingAssistantUtils.detectInstalledAgents();
   * // Returns: { 'claude-code': true, 'cursor': false, 'kilocode': true, ... }
   * ```
   */
  static async detectInstalledAgents(): Promise<Record<string, boolean>> {
    const providers = getAllCodingAssistants();

    const results = await Promise.all(
      providers.map(async (provider) => {
        const availability = await provider.isAvailable();
        return [provider.id, availability.installed] as const;
      })
    );

    return Object.fromEntries(results);
  }
}

import { logger } from "../../../utils/logger/index.js";
import type { CodingAssistantProvider } from "../index.js";

/**
 * Cursor assistant provider implementation.
 * Handles availability checking and launch instructions for Cursor IDE.
 */
export const CursorCodingAssistantProvider: CodingAssistantProvider = {
  id: "cursor",
  displayName: "Cursor",
  command: "",

  async isAvailable(): Promise<{
    installed: boolean;
    installCommand?: string;
  }> {
    // Cursor is always available as it's an IDE, not a CLI tool
    return { installed: true };
  },

  async launch({
    projectPath,
  }: {
    projectPath: string;
    prompt: string;
  }): Promise<void> {
    // Cursor doesn't support CLI launching, show instructions instead
    logger.userWarning("To start with Cursor:");
    logger.userInfo("  1. Open Cursor");
    logger.userInfo(`  2. Open the folder: ${projectPath}`);
    logger.userInfo("  3. Use the initial prompt above with Cursor Composer");
  },
};

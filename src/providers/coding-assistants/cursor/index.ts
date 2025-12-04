import { ProcessUtils } from "../../../utils/process.util.js";
import { logger } from "../../../utils/logger/index.js";
import type { CodingAssistantProvider } from "../index.js";
import * as os from "node:os";

/**
 * Checks if we're running on macOS.
 *
 * @returns true if running on macOS, false otherwise
 */
const isMac = (): boolean => {
  return os.platform() === "darwin";
};

/**
 * Cursor assistant provider implementation.
 * Handles availability checking and launching Cursor CLI.
 * On Mac, launches cursor-agent directly. On Windows/WSL, shows manual instructions.
 */
export const CursorCodingAssistantProvider: CodingAssistantProvider = {
  id: "cursor",
  displayName: "Cursor",
  command: "cursor-agent",

  async isAvailable(): Promise<{
    installed: boolean;
    installCommand?: string;
  }> {
    // Cursor is always available as it's an IDE, not a CLI tool
    return { installed: true };
  },

  async launch({
    projectPath,
    targetPath,
    prompt,
  }: {
    projectPath: string;
    targetPath: string;
    prompt: string;
  }): Promise<void> {
    // On Mac, try to launch cursor-agent directly
    if (isMac()) {
      try {
        logger.userInfo(`🤖 Launching ${this.displayName}...`);
        ProcessUtils.launchWithTerminalControl("cursor-agent", [prompt], {
          cwd: projectPath,
        });
        logger.userSuccess("Session complete!");
        return;
      } catch {
        logger.userWarning(`Could not auto-launch ${this.displayName}.`);
        // Fall through to show manual instructions
      }
    }

    // On Windows/WSL or if launch failed, show manual instructions
    const isCurrentDir = targetPath === ".";

    logger.userPlain('');
    logger.userPlain('To get started with Cursor:');
    logger.userPlain('');
    if (isCurrentDir) {
      logger.userPlain('  1. Open the current folder in Cursor:');
      logger.userPlain('');
      logger.userPlain('     cursor .');
    } else {
      logger.userPlain('  1. Open the project in Cursor:');
      logger.userPlain('');
      logger.userPlain(`     cursor ${targetPath}`);
    }
    logger.userPlain('');
    logger.userPlain('  2. Open Cursor Composer (Cmd+I or Ctrl+I)');
    logger.userPlain('');
    logger.userPlain('  3. Copy and paste the prompt above to start building your agent');
    logger.userPlain('');
  },
};

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
  displayName: "Cursor Agent",
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
    const path = isCurrentDir ? "." : targetPath;
    const composerShortcut = os.platform() === "darwin" ? "Cmd+I" : "Ctrl+I";

    logger.userPlain("");
    logger.userPlain("┌─────────────────────────────────────────────────────┐");
    logger.userPlain("│  🚀 Next Steps                                      │");
    logger.userPlain("└─────────────────────────────────────────────────────┘");
    logger.userPlain("");
    logger.userPlain(`  1. Launch Cursor with your project:`);
    logger.userPlain("");
    logger.userPlain(`     cursor-agent ${path}`);
    logger.userPlain("");
    logger.userPlain(`  2. Open Cursor (${composerShortcut})`);
    logger.userPlain("");
    logger.userPlain("  3. Paste the prompt above and start building!");
    logger.userPlain("");
  },
};

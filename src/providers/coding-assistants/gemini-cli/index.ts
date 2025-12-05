import * as os from "node:os";
import { ProcessUtils } from "../../../utils/process.util.js";
import { logger } from '../../../utils/logger/index.js';
import type { CodingAssistantProvider } from '../index.js';

/**
 * Checks if we're running on a Unix platform (Mac/Linux/WSL).
 *
 * @returns true if running on Unix platform, false otherwise
 */
const isUnix = (): boolean => {
  return os.platform() !== "win32";
};

/**
 * Google Gemini CLI coding assistant provider.
 * Reference: https://github.com/google-gemini/gemini-cli
 */
export const GeminiCLICodingAssistantProvider: CodingAssistantProvider = {
  id: 'gemini-cli',
  displayName: 'Gemini CLI',
  command: 'gemini',

  async isAvailable() {
    return {
      installed: true,
      installCommand: 'npm install -g @google/gemini-cli',
    };
  },

  async launch({ projectPath, targetPath, prompt }) {
    // Try auto-launch with prompt on Unix platforms (Mac/Linux/WSL)
    if (isUnix()) {
      try {
        logger.userInfo(`🤖 Launching ${this.displayName}...`);
        // Use -p flag for non-interactive mode with prompt
        ProcessUtils.launchWithTerminalControl("gemini", ["-p", prompt], { cwd: projectPath });
        logger.userSuccess("Session complete!");
        return;
      } catch {
        logger.userWarning(`Could not auto-launch ${this.displayName}.`);
        // Fall through to manual instructions
      }
    }

    // Manual instructions (Windows or if launch failed)
    const isCurrentDir = targetPath === '.';

    logger.userPlain('');
    logger.userPlain('To get started with Gemini CLI:');
    logger.userPlain('');

    if (isCurrentDir) {
      logger.userPlain('  Run:');
      logger.userPlain('');
      logger.userPlain(`    gemini -p "${prompt}"`);
    } else {
      logger.userPlain('  Navigate to project and run:');
      logger.userPlain('');
      logger.userPlain(`    cd ${targetPath}`);
      logger.userPlain(`    gemini -p "${prompt}"`);
    }
    logger.userPlain('');
  },

};

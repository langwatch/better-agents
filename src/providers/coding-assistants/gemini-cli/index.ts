import { CliUtils } from '../../../utils/cli.util.js';
import { OSUtils } from '../../../utils/os.util.js';
import { ProcessUtils } from "../../../utils/process.util.js";
import { logger } from '../../../utils/logger/index.js';
import type { CodingAssistantProvider } from '../index.js';

/**
 * Google Gemini CLI coding assistant provider.
 * Reference: https://github.com/google-gemini/gemini-cli
 */
export const GeminiCLICodingAssistantProvider: CodingAssistantProvider = {
  id: 'gemini-cli',
  displayName: 'Gemini CLI',
  command: 'gemini',

  async isAvailable() {
    const installed = await CliUtils.isCommandAvailable("gemini");
    return {
      installed,
      installCommand: installed ? undefined : 'npm install -g @google/gemini-cli',
    };
  },

  async launch({ projectPath, targetPath, prompt }) {
    // Try auto-launch with prompt on Unix platforms (Mac/Linux/WSL)
    if (OSUtils.isUnix) {
      try {
        logger.userInfo(`🤖 Launching ${this.displayName}...`);
        // Use -p flag for non-interactive mode with prompt
        ProcessUtils.launchWithTerminalControl("gemini", ["-p", prompt], { cwd: projectPath });
        logger.userSuccess("Session complete!");
        return;
      } catch (error) {
        // Log to debug logger for troubleshooting
        if (error instanceof Error) {
          logger.error(error, { step: "gemini-launch-failed" });
        } else {
          logger.debug("gemini-launch-failed", { error: String(error) });
        }
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

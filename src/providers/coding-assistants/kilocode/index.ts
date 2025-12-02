import { ProcessUtils } from "../../../utils/process.util.js";
import { CliUtils } from "../../../utils/cli.util.js";
import { logger } from "../../../utils/logger/index.js";
import type { CodingAssistantProvider } from "../index.js";

/**
 * Kilocode assistant provider implementation.
 * Handles availability checking and launching Kilocode CLI.
 */
export const KilocodeCodingAssistantProvider: CodingAssistantProvider = {
  id: "kilocode",
  displayName: "Kilocode CLI",
  command: "kilocode",

  async isAvailable(): Promise<{
    installed: boolean;
    installCommand?: string;
  }> {
    const installed = await CliUtils.isCommandAvailable("kilocode");
    return {
      installed,
      installCommand: installed ? undefined : "npm install -g @kilocode/cli",
    };
  },

  async launch({
    projectPath,
    prompt,
  }: {
    projectPath: string;
    prompt: string;
  }): Promise<void> {
    try {
      logger.userInfo(`🤖 Launching ${this.displayName}...`);
      // Launch kilocode with full terminal control
      // This blocks until kilocode exits
      ProcessUtils.launchWithTerminalControl("kilocode", ["-a", prompt], {
        cwd: projectPath,
      });
      logger.userSuccess("Session complete!");
    } catch (error) {
      if (error instanceof Error) {
        logger.userError(
          `Failed to launch ${this.displayName}: ${error.message}`
        );
      }
      throw error;
    }
  },
};

import { ProcessUtils } from "../../../utils/process.util.js";
import { CliUtils } from "../../../utils/cli.util.js";
import { logger } from "../../../utils/logger/index.js";
import type { CodingAssistantProvider } from "../index.js";

/**
 * Claude Code assistant provider implementation.
 * Handles availability checking and launching Claude Code CLI.
 */
export const ClaudeCodingAssistantProvider: CodingAssistantProvider = {
  id: "claude-code",
  displayName: "Claude Code",
  command: "claude",

  async isAvailable(): Promise<{
    installed: boolean;
    installCommand?: string;
  }> {
    const installed = await CliUtils.isCommandAvailable("claude");
    return {
      installed,
      installCommand: installed
        ? undefined
        : "npm install -g @anthropic-ai/claude-code",
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
      // Launch claude with full terminal control
      // This blocks until claude exits
      ProcessUtils.launchWithTerminalControl("claude", [prompt], {
        cwd: projectPath,
      });
      logger.userSuccess("Session complete!");
    } catch (error) {
      if (error instanceof Error) {
        logger.userError(`Failed to launch ${this.displayName}: ${error.message}`);
      }
      throw error;
    }
  },
};

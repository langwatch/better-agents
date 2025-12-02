import { logger } from "../../../utils/logger/index.js";
import type { CodingAssistantProvider } from "../index.js";

/**
 * None provider - for users who want to set up the project but prompt their assistant manually.
 * Editor configuration is handled centrally by editor-setup-builder.
 */
export const NoneCodingAssistantProvider: CodingAssistantProvider = {
  id: "none",
  displayName: "None - I will prompt it myself",
  command: "",

  async isAvailable(): Promise<{
    installed: boolean;
    installCommand?: string;
  }> {
    // "None" option is always available since it doesn't require installation
    return { installed: true };
  },

  async launch(_params: {
    projectPath: string;
    prompt: string;
  }): Promise<void> {
    // No auto-launch - just show instructions
    logger.userInfo(
      "When you're ready, use the initial prompt above with your coding assistant."
    );
  },
};

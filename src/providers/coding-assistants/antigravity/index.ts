import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { logger } from "../../../utils/logger/index.js";
import type { CodingAssistantProvider, MCPConfigFile } from "../index.js";

/**
 * Antigravity assistant provider implementation.
 * Handles availability checking and launch instructions for Antigravity IDE.
 *
 * Note: Antigravity has special MCP config handling - it uses ~/.gemini/antigravity/mcp_config.json
 * instead of project-local config files.
 */
export const AntigravityCodingAssistantProvider: CodingAssistantProvider = {
  id: "antigravity",
  displayName: "Antigravity",
  command: "agy",

  async isAvailable(): Promise<{
    installed: boolean;
    installCommand?: string;
  }> {
    // Antigravity is always available as it's an IDE, not a CLI tool
    return { installed: true };
  },

  async launch({
    targetPath,
  }: {
    projectPath: string;
    targetPath: string;
    prompt: string;
  }): Promise<void> {
    const isCurrentDir = targetPath === ".";

    logger.userPlain('');
    logger.userPlain('To get started with Antigravity:');
    logger.userPlain('');
    if (isCurrentDir) {
      logger.userPlain('  1. Open the current folder in Antigravity:');
      logger.userPlain('');
      logger.userPlain('     agy .');
    } else {
      logger.userPlain('  1. Open the project in Antigravity:');
      logger.userPlain('');
      logger.userPlain(`     agy ${targetPath}`);
    }
    logger.userPlain('');
    logger.userPlain('  2. Copy and paste the prompt above to start building your agent');
    logger.userPlain('');
  },
};

/**
 * Sets up MCP config for Antigravity in the user's home directory.
 * Antigravity uses ~/.gemini/antigravity/mcp_config.json instead of project-local config.
 *
 * This function:
 * - Creates the config file if it doesn't exist
 * - Merges new MCPs into existing config (idempotent - skips existing keys)
 *
 * @param mcpConfig - MCP configuration to merge
 * @returns Promise that resolves when config is updated
 *
 * @example
 * ```ts
 * await setupAntigravityMCPConfig(mcpConfig);
 * ```
 */
export const setupAntigravityMCPConfig = async (
  mcpConfig: MCPConfigFile
): Promise<void> => {
  const antigravityConfigDir = path.join(os.homedir(), ".gemini", "antigravity");
  const antigravityConfigPath = path.join(antigravityConfigDir, "mcp_config.json");

  // Ensure directory exists
  await fs.mkdir(antigravityConfigDir, { recursive: true });

  let existingConfig: MCPConfigFile = { mcpServers: {} };

  // Try to read existing config
  try {
    const existingContent = await fs.readFile(antigravityConfigPath, "utf-8");
    existingConfig = JSON.parse(existingContent) as MCPConfigFile;

    // Ensure mcpServers exists
    if (!existingConfig.mcpServers) {
      existingConfig.mcpServers = {};
    }
  } catch {
    // File doesn't exist or is invalid, start fresh
    existingConfig = { mcpServers: {} };
  }

  // Merge new MCPs into existing config (skip existing keys for idempotency)
  for (const [key, value] of Object.entries(mcpConfig.mcpServers)) {
    if (!(key in existingConfig.mcpServers)) {
      existingConfig.mcpServers[key] = value;
    }
  }

  // Write merged config
  await fs.writeFile(
    antigravityConfigPath,
    JSON.stringify(existingConfig, null, 2)
  );

  logger.userInfo(`Antigravity MCP config updated at: ${antigravityConfigPath}`);
};



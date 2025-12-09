import * as fs from "fs/promises";
import * as os from "node:os";
import * as path from "path";
import type { ProjectConfig } from "../types.js";
import type { MCPConfigFile } from "../providers/coding-assistants/index.js";

/**
 * Writes CLI-specific configuration files for coding assistants that support them.
 * These configs include MCP server configurations and project context.
 *
 * @param params - Parameters object
 * @param params.projectPath - Absolute path to project root
 * @param params.config - Project configuration
 * @param params.mcpConfig - MCP configuration to include in CLI configs
 * @returns Promise that resolves when all CLI configs are written
 *
 * @example
 * ```ts
 * await setupCLIConfigs({
 *   projectPath: '/path/to/project',
 *   config: { codingAssistant: 'gemini-cli', ... },
 *   mcpConfig: { mcpServers: { langwatch: {...} } }
 * });
 * ```
 */
export const setupCLIConfigs = async ({
  projectPath,
  config,
  mcpConfig,
}: {
  projectPath: string;
  config: ProjectConfig;
  mcpConfig: MCPConfigFile;
}): Promise<void> => {
  const assistant = config.codingAssistant;

  // Gemini CLI config - uses ~/.gemini/settings.json (user home directory)
  if (assistant === "gemini-cli") {
    const geminiConfigDir = path.join(os.homedir(), ".gemini");
    await fs.mkdir(geminiConfigDir, { recursive: true });
    const geminiConfigPath = path.join(geminiConfigDir, "settings.json");

    // Read existing config if it exists, otherwise start fresh
    let geminiConfig: Record<string, unknown> = {};

    try {
      const existingContent = await fs.readFile(geminiConfigPath, "utf-8");
      geminiConfig = JSON.parse(existingContent) as Record<string, unknown>;
    } catch {
      // File doesn't exist, start fresh
    }

    geminiConfig.mcpServers = structuredClone(mcpConfig.mcpServers)

    await fs.writeFile(
      geminiConfigPath,
      JSON.stringify(geminiConfig, null, 2)
    );
  }

  // Crush config - uses crush.json in project root (not .crush/config.json)
  if (assistant === "crush") {
    const crushConfigPath = path.join(projectPath, "crush.json");

    // Read existing config if it exists, otherwise start fresh
    let crushConfig: Record<string, unknown> = {
      $schema: "https://charm.land/crush.json",
    };

    try {
      const existingContent = await fs.readFile(crushConfigPath, "utf-8");
      crushConfig = JSON.parse(existingContent) as Record<string, unknown>;
    } catch {
      // File doesn't exist, start with schema
    }

    // Convert MCP config to Crush's format
    // Crush expects "mcp" (not "mcpServers") and requires "type" field for each server
    if (!crushConfig.mcp) {
      crushConfig.mcp = {};
    }

    const crushMCP = crushConfig.mcp as Record<string, unknown>;
    
    // Convert each MCP server to Crush's format
    for (const [key, server] of Object.entries(mcpConfig.mcpServers)) {
      if (typeof server === "object" && server !== null) {
        // If it already has a type, use it; otherwise default to "stdio"
        const serverConfig = server as { type?: string; command?: string; args?: string[]; transport?: string; url?: string };
        
        if ("type" in serverConfig && serverConfig.type === "http") {
          // HTTP transport
          crushMCP[key] = {
            type: "http",
            transport: serverConfig.transport || "http",
            url: serverConfig.url,
          };
        } else {
          // stdio transport (default)
          crushMCP[key] = {
            type: "stdio",
            command: serverConfig.command,
            args: serverConfig.args || [],
          };
        }
      }
    }

    // Add project context as a comment/documentation field
    if (!crushConfig.projectContext) {
      crushConfig.projectContext = {
        framework: config.framework,
        language: config.language,
        goal: config.projectGoal,
      };
    }

    await fs.writeFile(
      crushConfigPath,
      JSON.stringify(crushConfig, null, 2)
    );
  }

  // Qwen Code config - uses ~/.gemini/settings.json (same as Gemini CLI)
  // Since Qwen Code is based on Gemini CLI, it uses the same config location
  if (assistant === "qwen-code") {
    const geminiConfigDir = path.join(os.homedir(), ".gemini");
    await fs.mkdir(geminiConfigDir, { recursive: true });
    const geminiConfigPath = path.join(geminiConfigDir, "settings.json");

    // Read existing config if it exists, otherwise start fresh
    let geminiConfig: Record<string, unknown> = {};

    try {
      const existingContent = await fs.readFile(geminiConfigPath, "utf-8");
      geminiConfig = JSON.parse(existingContent) as Record<string, unknown>;
    } catch {
      // File doesn't exist, start fresh
    }

    geminiConfig.mcpServers = JSON.parse(JSON.stringify(mcpConfig.mcpServers));

    await fs.writeFile(
      geminiConfigPath,
      JSON.stringify(geminiConfig, null, 2)
    );
  }
};


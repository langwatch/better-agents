import type { ProjectConfig } from "../types.js";
import { getFrameworkProvider } from "../providers/frameworks/index.js";
import { getCodingAssistantProvider } from "../providers/coding-assistants/index.js";
import type { MCPConfigFile } from "../providers/coding-assistants/index.js";

/**
 * Builds and writes MCP configuration using providers.
 *
 * @param params - Parameters object
 * @param params.projectPath - Absolute path to project root
 * @param params.config - Project configuration
 * @returns Promise that resolves when config is written
 *
 * @example
 * ```ts
 * await buildMCPConfig({ projectPath: '/path/to/project', config });
 * ```
 */
export const buildMCPConfig = async ({
  projectPath,
  config,
}: {
  projectPath: string;
  config: ProjectConfig;
}): Promise<void> => {
  const mcpConfig: MCPConfigFile = {
    mcpServers: {},
  };

  // Always add LangWatch MCP
  mcpConfig.mcpServers.langwatch = {
    command: "npx",
    args: ["-y", "@langwatch/mcp-server"],
  };

  // Add framework-specific MCP if available
  const frameworkProvider = getFrameworkProvider({
    framework: config.framework,
  });
  const frameworkMCP = frameworkProvider.getMCPConfig?.();
  if (frameworkMCP) {
    mcpConfig.mcpServers[frameworkProvider.id] = frameworkMCP;
  }

  // Write using coding assistant provider
  const assistantProvider = getCodingAssistantProvider({
    assistant: config.codingAssistant,
  });
  await assistantProvider.writeMCPConfig({ projectPath, config: mcpConfig });
};


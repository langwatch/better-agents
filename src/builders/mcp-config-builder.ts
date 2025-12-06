import type { ProjectConfig } from "../types.js";
import { getFrameworkProvider } from "../providers/frameworks/index.js";
import type { MCPConfigFile } from "../providers/coding-assistants/index.js";

/**
 * Builds MCP configuration object based on project settings.
 *
 * @param params - Parameters object
 * @param params.config - Project configuration
 * @returns MCP configuration object
 *
 * @example
 * ```ts
 * const mcpConfig = buildMCPConfig({ config });
 * // Returns: { mcpServers: { langwatch: {...}, mastra: {...} } }
 * ```
 */
export const buildMCPConfig = ({
  config,
}: {
  config: ProjectConfig;
}): MCPConfigFile => {
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

  return mcpConfig;
};


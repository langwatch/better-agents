import type { MCPServerConfig } from "../index.js";

/**
 * Returns Letta MCP server configuration for documentation.
 * Uses hosted docs server for Letta SDK reference.
 *
 * @returns MCP server configuration object
 */
export const getMCPConfig = (): MCPServerConfig => ({
  type: "stdio",
  command: "npx",
  args: ["-y", "mcp-remote", "https://docs.letta.com/mcp"],
});

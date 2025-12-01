import type { MCPServerConfig } from "../index.js";

/**
 * Returns Agno MCP server configuration pointing to the hosted docs server.
 * Uses mcp-remote proxy to connect Cursor to the HTTP-based MCP server.
 *
 * @returns MCP server configuration object
 *
 * @example
 * ```ts
 * const mcpConfig = getMCPConfig();
 * ```
 */
export const getMCPConfig = (): MCPServerConfig => ({
  type: "stdio",
  command: "npx",
  args: ["-y", "mcp-remote", "https://docs.agno.com/mcp"],
});



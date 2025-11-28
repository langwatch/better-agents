import type { MCPServerConfig } from "../index.js";

/**
 * Returns Agno MCP server configuration pointing to the hosted docs server.
 *
 * @returns MCP server configuration object
 *
 * @example
 * ```ts
 * const mcpConfig = getMCPConfig();
 * ```
 */
export const getMCPConfig = (): MCPServerConfig => ({
  type: "http",
  transport: "streamable-http",
  url: "https://docs.agno.com/mcp",
});



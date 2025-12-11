import type { MCPServerConfig } from "../index.js";

/**
 * Returns Vercel AI SDK MCP server configuration.
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
  command: "uvx",
  args: [
    "--from",
    "mcpdoc",
    "mcpdoc",
    "--urls",
    "Vercel:https://ai-sdk.dev/docs/introduction",
    "--transport",
    "stdio",
  ],
});

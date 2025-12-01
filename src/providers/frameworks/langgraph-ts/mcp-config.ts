import type { MCPServerConfig } from "../index.js";

/**
 * Returns LangGraph TypeScript MCP server configuration.
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
  args: [
    "-y",
    "mcpdoc",
    "--urls",
    "LangGraphJS:https://langchain-ai.github.io/langgraphjs/llms.txt LangChainJS:https://js.langchain.com/llms.txt",
    "--transport",
    "stdio",
  ],
});


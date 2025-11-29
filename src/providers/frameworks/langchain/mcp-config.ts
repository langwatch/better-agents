import type { MCPServerConfig } from "../index.js";

/**
 * Returns Langchain MCP server configuration.
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
    "LangGraph:https://langchain-ai.github.io/langgraph/llms.txt LangChain:https://python.langchain.com/llms.txt",
    "--transport",
    "stdio"
  ],
});
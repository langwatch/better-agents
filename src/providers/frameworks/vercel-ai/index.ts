import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { getMCPConfig } from "./mcp-config.js";

/**
 * Vercel AI SDK framework provider implementation.
 * Provides TypeScript-based agent framework with MCP server.
 */
export const VercelAIFrameworkProvider: FrameworkProvider = {
  id: "vercel-ai",
  displayName: "Vercel AI SDK",
  language: "typescript",

  getKnowledge,
  getMCPConfig,
  setup: async () => {
    // Vercel AI SDK doesn't need special setup files
  },
};

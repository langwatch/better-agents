import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { getMCPConfig } from "./mcp-config.js";

/**
 * Mastra framework provider implementation.
 * Provides TypeScript-based agent framework with MCP server.
 */
export const MastraFrameworkProvider: FrameworkProvider = {
  id: "mastra",
  displayName: "Mastra",
  language: "typescript",

  getKnowledge,
  getMCPConfig,
  setup: async () => {
    // Mastra doesn't need special setup files
  },
};


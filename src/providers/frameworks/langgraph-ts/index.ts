import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { getMCPConfig } from "./mcp-config.js";

/**
 * LangGraph TypeScript framework provider implementation.
 * Provides TypeScript-based agent framework with MCP server.
 */
export const LangGraphTSFrameworkProvider: FrameworkProvider = {
  id: "langgraph-ts",
  displayName: "LangGraph (TypeScript)",
  language: "typescript",

  getKnowledge,
  getMCPConfig,
  setup: async () => {
    // LangGraph TS doesn't need special setup files
  },
};


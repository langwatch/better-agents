import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { getMCPConfig } from "./mcp-config.js";

/**
 * Letta framework provider implementation.
 * Provides Python-based agent framework with stateful memory and MCP integration.
 */
export const LettaPyFrameworkProvider: FrameworkProvider = {
  id: "letta-py",
  displayName: "Letta (Python)",
  language: "python",
  getKnowledge,
  getMCPConfig,
  setup: async () => {
    // Letta SDK uses MCP for documentation - no additional setup files needed
  },
};

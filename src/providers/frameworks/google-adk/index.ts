import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { getMCPConfig } from "./mcp-config.js";

/**
 * Google ADK framework provider implementation.
 * Provides Google ADK with MCP server for documentation.
 * Google ADK is a framework for building agents with Google's ADK.
*/

export const GoogleAdkFrameworkProvider: FrameworkProvider = {
  id: "google-adk",
  displayName: "Google ADK",
  language: "python",

  getKnowledge,
  getMCPConfig,
  // setup,
  setup: async () => {
    // Google ADK doesn't need special setup files
    // TODO: Implement setup for Google ADK
  },
};


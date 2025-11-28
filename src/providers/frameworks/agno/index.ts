import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { setup } from "./setup.js";
import { getMCPConfig } from "./mcp-config.js";

/**
 * Agno framework provider implementation.
 * Provides Python-based agent framework with .cursorrules and llms.txt setup.
 */
export const AgnoFrameworkProvider: FrameworkProvider = {
  id: "agno",
  displayName: "Agno",
  language: "python",

  getKnowledge,
  getMCPConfig,
  setup,
};


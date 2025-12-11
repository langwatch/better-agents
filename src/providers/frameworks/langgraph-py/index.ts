import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { getMCPConfig } from "./mcp-config.js";

export const LangGraphPyFrameworkProvider: FrameworkProvider = {
  id: "langgraph-py",
  displayName: "LangGraph (Python)",
  language: "python",
  getKnowledge,
  getMCPConfig,
  setup: async () => {
    // LangGraph Python doesn't need special setup files
  },
};  
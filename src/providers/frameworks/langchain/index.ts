import type { FrameworkProvider } from "../index.js";
import { getKnowledge } from "./knowledge.js";
import { getMCPConfig } from "./mcp-config.js";


export const LangchainFrameworkProvider: FrameworkProvider = {
    id: "langchain",
    displayName: "Langchain",
    language: "python",
    getKnowledge,
    getMCPConfig,
    setup: async () => {
        // Langchain doesn't need special setup files
    },
    
};
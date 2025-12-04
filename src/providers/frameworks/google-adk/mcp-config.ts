import type { MCPServerConfig } from "../index.js";

export const getMCPConfig = (): MCPServerConfig => ({
  type: "stdio",
  command: "uvx",
  args: [
    "--from",
    "mcpdoc",
    "mcpdoc",
    "--urls",
    "Google-Adk:https://github.com/google/adk-python/blob/main/llms.txt",
    "--transport",
    "stdio"
  ],
});
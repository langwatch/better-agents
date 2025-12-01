import type { FrameworkKnowledge } from "../index.js";

/**
 * Returns LangGraph (Python) framework knowledge for documentation and prompts.
 *
 * @returns Framework knowledge object
 *
 * @example
 * ```ts
 * const knowledge = getKnowledge();
 * console.log(knowledge.setupInstructions);
 * ```
 */
export const getKnowledge = (): FrameworkKnowledge => ({
  setupInstructions: "Python w/uv + pytest",
  toolingInstructions:
    "Use the LangGraph MCP to learn about LangGraph + LangChain docs and how to build agents",
  agentsGuideSection: `## Framework-Specific Guidelines

### LangGraph Python Framework

**Always use the LangGraph MCP for learning:**

- The LangGraph MCP server provides real-time documentation for LangGraph and LangChain
- Ask it questions about LangGraph/LangChain APIs and best practices
- Follow LangGraph's recommended patterns for agent development

**When implementing agent features:**
1. Consult the LangGraph MCP: "How do I [do X] in LangGraph?"
2. Use LangChain's Python integrations for tools, memory, and models
3. Follow LangGraph's node/state patterns when structuring agents
4. Leverage LangChain's ecosystem for additional capabilities

**Initial setup:**
1. Use \`uv init\` to create a new LangGraph project
2. Inspect the generated structure, removing anything unnecessary
3. Implement the requested agent logic and write tests
4. Run the app with \`uv run app.py\` to validate behaviour

---
`,
});
import type { FrameworkKnowledge } from "../index.js";

/**
 * Returns Langchain framework knowledge for documentation and prompts.
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
  toolingInstructions: "Use the Langchain MCP to learn about Langchain and how to build agents",
  agentsGuideSection: `## Framework-Specific Guidelines

### Langchain Framework

**Always use the Langchain MCP for learning:**

- The Langchain MCP server provides real-time documentation
- Ask it questions about Langchain APIs and best practices
- Follow Langchain's recommended patterns for agent development

**When implementing agent features:**
1. Consult the Langchain MCP: "How do I [do X] in Langchain?"
2. Use Langchain's built-in agent capabilities
3. Follow Langchain's Python patterns and conventions
4. Leverage Langchain's integration ecosystem

**Initial setup:**
1. Use \`uv init\` to create a new Langchain project, do it before setting up the rest of the project, right after having done \`uv init\`.
2. Then explore the setup it created, the folders, remove what not needed
3. Proceed with the user definition request to implement the agent and test it out
4. Open the UI for user to see using \`uv run app.py\`

---
`,
});
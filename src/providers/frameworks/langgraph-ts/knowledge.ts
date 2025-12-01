import type { FrameworkKnowledge } from "../index.js";

/**
 * Returns LangGraph TypeScript framework knowledge for documentation and prompts.
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
  setupInstructions: "TypeScript w/pnpm + vitest",
  toolingInstructions:
    "Use the LangGraph MCP to learn about LangGraph.js and how to build agents",
  agentsGuideSection: `## Framework-Specific Guidelines

### LangGraph TypeScript Framework

**Always use the LangGraph MCP for learning:**

- The LangGraph MCP server provides real-time documentation for LangGraph.js
- Ask it questions about LangGraph APIs and best practices
- Follow LangGraph's recommended patterns for agent development

**When implementing agent features:**
1. Consult the LangGraph MCP: "How do I [do X] in LangGraph.js?"
2. Use LangGraph's built-in agent capabilities (StateGraph, nodes, edges)
3. Follow LangGraph's TypeScript patterns and conventions
4. Leverage LangChain.js integration ecosystem

**Initial setup:**
1. Use \`pnpm init\` to create a new project
2. Install dependencies: \`pnpm add @langchain/langgraph @langchain/core @langchain/openai\`
3. Set up TypeScript configuration
4. Proceed with the user definition request to implement the agent and test it out
5. Run the agent using \`pnpm tsx src/index.ts\`

**Key Concepts:**
- **StateGraph**: Define your agent's state and transitions
- **Nodes**: Functions that process state and return updates
- **Edges**: Define flow between nodes (conditional or direct)
- **Checkpointer**: Enable conversation memory and state persistence

---
`,
});


import type { FrameworkKnowledge } from "../index.js";

/**
 * Returns Vercel AI SDK framework knowledge for documentation and prompts.
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
    "Use the Vercel MCP to learn about Vercel AI SDK and how to build agents",
  agentsGuideSection: `## Framework-Specific Guidelines

### Vercel AI SDK Framework

**Always use the Vercel MCP for learning:**

- The Vercel MCP server provides real-time documentation for Vercel AI SDK
- Ask it questions about Vercel AI SDK APIs and best practices
- Follow Vercel AI SDK's recommended patterns for agent development

**When implementing agent features:**
1. Consult the Vercel MCP: "How do I [do X] in Vercel AI SDK?"
2. Use Vercel AI SDK's unified provider architecture
3. Follow Vercel AI SDK's TypeScript patterns and conventions
4. Leverage Vercel AI SDK's framework integrations (Next.js, React, Svelte, Vue, Node.js)

**Initial setup:**
1. Use \`pnpm init\` to create a new project
2. Install dependencies: \`pnpm add ai @ai-sdk/openai\` (or other provider packages like \`@ai-sdk/anthropic\`, \`@ai-sdk/google\`)
3. Set up TypeScript configuration
4. Proceed with the user definition request to implement the agent and test it out
5. Run the agent using \`pnpm tsx src/index.ts\` or integrate with your chosen framework

**Key Concepts:**
- **Unified Provider Architecture**: Consistent interface across multiple AI model providers
- **generateText**: Generate text using any supported model
- **streamText**: Stream text responses for real-time interactions
- **Framework Integration**: Works with Next.js, React, Svelte, Vue, and Node.js

---
`,
});

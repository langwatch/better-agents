import type { FrameworkKnowledge } from "../index.js";

/**
 * Returns Agno framework knowledge for documentation and prompts.
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
    "Use the Agno MCP to learn about Agno and how to build agents",
  agentsGuideSection: `## Framework-Specific Guidelines

### Agno Framework

**Always use the Agno MCP for learning:**

- The Agno MCP server provides real-time documentation
- Ask it questions about Agno APIs and best practices
- Follow Agno's recommended patterns for agent development

**Core Rules:**
- NEVER create agents in loops - reuse them for performance
- Always use output_schema for structured responses
- PostgreSQL in production, SQLite for dev only
- Start with single agent, scale up only when needed

**Basic Agent:**
\`\`\`python
from agno.agent import Agent
from agno.models.openai import OpenAIChat

agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    instructions="You are a helpful assistant",
    markdown=True,
)
agent.print_response("Your query", stream=True)
\`\`\`

**Agent with Tools:**
\`\`\`python
from agno.tools.duckduckgo import DuckDuckGoTools

agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools()],
    instructions="Search the web for information",
)
\`\`\`

**CRITICAL - Agent Reuse:**
\`\`\`python
# WRONG - Recreates agent every time (significant overhead)
for query in queries:
    agent = Agent(...)  # DON'T DO THIS

# CORRECT - Create once, reuse
agent = Agent(...)
for query in queries:
    agent.run(query)
\`\`\`

**When to Use Each Pattern:**
- **Single Agent (90% of use cases):** One clear task, solved with tools + instructions
- **Team (autonomous):** Multiple specialized agents with different expertise
- **Workflow (programmatic):** Sequential steps with conditional logic

**Structured Output:**
\`\`\`python
from pydantic import BaseModel

class Result(BaseModel):
    summary: str
    findings: list[str]

agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    output_schema=Result,
)
result: Result = agent.run(query).content
\`\`\`

**Common Mistakes to Avoid:**
- Creating agents in loops (massive performance hit)
- Using Team when single agent would work
- Forgetting search_knowledge=True with knowledge
- Using SQLite in production
- Missing output_schema validation

**Resources:** https://docs.agno.com/

---
`,
});


import type { ProjectConfig } from '../../types.js';

/**
 * Builds project structure and workflow sections for AGENTS.md.
 * 
 * @param params - Parameters object
 * @param params.config - Project configuration
 * @returns Markdown string for structure and workflow sections
 * 
 * @example
 * ```ts
 * const section = buildWorkflowSection({ config });
 * ```
 */
export const buildWorkflowSection = ({ config }: { config: ProjectConfig }): string => {
  const srcDir = config.framework === 'mastra' ? 'src' : 'app';
  const scenarioPattern =
    config.language === 'python' ? 'test_*.py' : '*.test.ts';

  return `## Project Structure

This project follows a standardized structure for production-ready agents:

\`\`\`
|__ ${srcDir}/           # Main application code
|__ prompts/          # Versioned prompt files (YAML)
|_____ *.yaml
|__ tests/
|_____ evaluations/   # Jupyter notebooks for component evaluation
|________ *.ipynb
|_____ scenarios/     # End-to-end scenario tests
|________ ${scenarioPattern}
|__ prompts.json      # Prompt registry
|__ .env              # Environment variables (never commit!)
\`\`\`

---

## Development Workflow

### When Starting a New Feature:

1. **Understand Requirements**: Clarify what the agent should do
2. **Design the Approach**: Plan which components you'll need
3. **Implement with Prompts**: Use LangWatch Prompt CLI to create/manage prompts
4. **Write Unit Tests**: Test deterministic components
5. **Create Evaluations**: Build evaluation notebooks for probabilistic components
6. **Write Scenario Tests**: Create end-to-end tests using Scenario
7. **Run Tests**: Verify everything works before moving on

### Always:

- ✅ Version control your prompts
- ✅ Write tests for new features
- ✅ Use LangWatch MCP to learn best practices
- ✅ Follow the Agent Testing Pyramid
- ✅ Document your agent's capabilities

### Never:

- ❌ Hardcode prompts in application code
- ❌ Skip testing new features
- ❌ Commit API keys or sensitive data
- ❌ Optimize without measuring (use evaluations first)

---

## Using LangWatch MCP

The LangWatch MCP server provides expert guidance on:

- Prompt management with Prompt CLI
- Writing Scenario tests
- Creating evaluations
- Best practices for agent development

**How to use it:**
Simply ask your coding assistant questions like:
- "How do I use the LangWatch Prompt CLI?"
- "Show me how to write a Scenario test"
- "How do I create an evaluation for my RAG system?"

The MCP will provide up-to-date documentation and examples.

---

## Getting Started

1. **Set up your environment**: Copy \`.env.example\` to \`.env\` and fill in your API keys
2. **Learn the tools**: Ask the LangWatch MCP about prompt management and testing
3. **Start building**: Implement your agent in the \`${srcDir}/\` directory
4. **Write tests**: Create scenario tests for your agent's capabilities
5. **Iterate**: Use evaluations to improve your agent's performance

---

## Resources

- **Scenario Documentation**: https://scenario.langwatch.ai/
- **Agent Testing Pyramid**: https://scenario.langwatch.ai/best-practices/the-agent-testing-pyramid
- **LangWatch Dashboard**: https://app.langwatch.ai/
${config.framework === 'agno' ? '- **Agno Documentation**: https://docs.agno.com/' : '- **Mastra Documentation**: Use the Mastra MCP for up-to-date docs'}

---

Remember: Building production-ready agents means combining great AI capabilities with solid software engineering practices. Follow these guidelines to create agents that are reliable, testable, and maintainable.
`;
};


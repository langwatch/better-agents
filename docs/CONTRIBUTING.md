# Contributing to Better Agents

Thank you for your interest in contributing to Better Agents! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/langwatch/better-agents
   cd better-agents
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Run the tests**
   ```bash
   pnpm test
   ```

To add support for a new agent framework:

1. **Update types** (`src/types.ts`):
   ```typescript
   export type AgentFramework = 'agno' | 'mastra' | 'your-framework';
   ```

2. **Add framework choice** (`src/prompts.ts`):
   ```typescript
   const frameworkChoices = [
     // existing choices
     { name: 'Your Framework', value: 'your-framework' },
   ];
   ```

3. **Add MCP configuration** (`src/utils/mcp-config.ts`):
   ```typescript
   if (config.framework === 'your-framework') {
     mcpConfig.mcpServers['your-framework'] = {
       // your MCP config
     };
   }
   ```

4. **Add framework guidelines** (`src/utils/agents-md.ts`):
   Add a new section in `getFrameworkGuidelines()` function.

5. **Add setup utility** (if needed):
   Create `src/utils/your-framework-config.ts` if special setup is required.

## Adding a New Coding Assistant

To add support for a new coding assistant:

1. **Update types** (`src/types.ts`):
   ```typescript
   export type CodingAssistant = 'claude-code' | 'your-assistant';
   ```

2. **Add assistant choice** (`src/prompts.ts`)

3. **Update MCP configuration** (`src/utils/mcp-config.ts`):
   Handle the new assistant's MCP config file format and location.

4. **Update kickoff logic** (`src/utils/kickoff-agent.ts`):
   Add instructions for launching the new assistant.

## Adding a New Language

To add support for a new programming language:

1. **Update types** (`src/types.ts`):
   ```typescript
   export type ProgrammingLanguage = 'python' | 'typescript' | 'your-language';
   ```

2. **Update prompts** (`src/prompts.ts`)

3. **Update project structure** (`src/utils/project-structure.ts`):
   Add language-specific file templates and conventions.

4. **Update AGENTS.md generator** (`src/utils/agents-md.ts`):
   Add language-specific guidelines.

## Code Style

- Use TypeScript strict mode
- Follow the existing code style
- Use `const` for functions: `const functionName = () => {}`
- Use explicit types, avoid `any`
- Use `type` over `interface`
- Add comments for complex logic

## Testing

Before submitting a PR:

1. **Build the project**
   ```bash
   pnpm build
   ```

2. **Test the CLI**
   ```bash
   pnpm dev init test-project
   ```

3. **Verify output**
   Check that the generated project has the correct structure and files.

## Submitting Changes

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clear, concise commit messages
   - Keep commits focused and atomic
   - Update documentation as needed

4. **Test your changes**

5. **Submit a pull request**
   - Describe what your changes do
   - Reference any related issues
   - Include screenshots if applicable

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord community
- Email us at support@langwatch.ai

Thank you for contributing! 🚀


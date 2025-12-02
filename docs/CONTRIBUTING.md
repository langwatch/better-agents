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

2. **Create a framework provider** (`src/providers/frameworks/your-framework/`):
   ```typescript
   // src/providers/frameworks/your-framework/index.ts
   export const YourFrameworkProvider: FrameworkProvider = {
     id: 'your-framework',
     language: 'python', // or 'typescript'
     displayName: 'Your Framework',
     async setup({ projectPath }) {
       // Framework-specific setup
     },
     getMCPConfig() {
       return { command: 'npx', args: [...] }; // optional
     },
     getAgentsGuidelines() {
       return '## Your Framework Guidelines\n...';
     },
   };
   ```

3. **Register the provider** (`src/providers/frameworks/index.ts`):
   Add your provider to the PROVIDERS map.

4. **Add framework choice** (`src/config-collection/choice-builders/framework-choices.ts`):
   Add your framework to the choices builder.

## Adding a New Coding Assistant

To add support for a new coding assistant:

1. **Update types** (`src/types.ts`):
   ```typescript
   export type CodingAssistant = 'claude-code' | 'cursor' | 'kilocode' | 'your-assistant' | 'none';
   ```

2. **Create an assistant provider** (`src/providers/coding-assistants/your-assistant/`):
   ```typescript
   // src/providers/coding-assistants/your-assistant/index.ts
   export const YourAssistantProvider: CodingAssistantProvider = {
     id: 'your-assistant',
     displayName: 'Your Assistant',
     command: 'your-cli-command',
     async isAvailable() {
       // Check if the assistant CLI is installed
       return { installed: true, installCommand: 'npm install -g your-cli' };
     },
     async launch({ projectPath, prompt }) {
       // Launch the assistant with the initial prompt
     },
   };
   ```

3. **Register the provider** (`src/providers/coding-assistants/index.ts`):
   Add your provider to the PROVIDERS map.

4. **Add assistant choice** (`src/config-collection/choice-builders/coding-assistant-choices.ts`):
   Add your assistant to the choices builder.

Note: Editor configuration (MCP files, etc.) is handled centrally by `src/builders/editor-setup-builder.ts`. If your assistant needs specific files, add them there.

## Adding a New Language

To add support for a new programming language:

1. **Update types** (`src/types.ts`):
   ```typescript
   export type ProgrammingLanguage = 'python' | 'typescript' | 'your-language';
   ```

2. **Create a language provider** (`src/providers/languages/your-language.ts`):
   ```typescript
   export const YourLanguageProvider: LanguageProvider = {
     id: 'your-language',
     displayName: 'Your Language',
     sourceDir: 'src', // or 'app'
     testFileExtension: '.test.yourlang',
     // Add language-specific configuration
   };
   ```

3. **Register the provider** (`src/providers/languages/index.ts`):
   Add your provider to the PROVIDERS map.

4. **Add language choice** (`src/config-collection/choice-builders/language-choices.ts`):
   Add your language to the choices builder.

5. **Update project scaffolding** (`src/project-scaffolding/`):
   Add language-specific file templates and conventions.

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


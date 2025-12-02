# Usage

## Initialize a new project

```bash
# In current directory
better-agents init .

# In a new directory
better-agents init my-awesome-agent
```

The CLI will guide you through:

1. **Programming Language**: Python or TypeScript
2. **Agent Framework**: Agno (Python) or Mastra (TypeScript)
3. **Coding Assistant**: Claude Code, Cursor, Kilocode CLI, or None (manual prompt)
4. **LLM Provider**: OpenAI, Anthropic, Gemini, Bedrock, OpenRouter, or Grok
5. **API Keys**: LLM Provider and LangWatch
6. **Project Goal**: What you want to build

## Examples

### Python + Agno

```bash
better-agents init trading-agent
# Select: Python, Agno, your preferred coding assistant, OpenAI
# Goal: "Build an agent that can analyze stock prices and provide trading recommendations"
```

### TypeScript + Mastra

```bash
better-agents init customer-support
# Select: TypeScript, Mastra, your preferred coding assistant, OpenAI
# Goal: "Build a customer support agent that can handle common queries and escalate complex issues"
```

### Coding Assistant Auto-Launch

After project setup completes, Better Agents **automatically launches** your chosen coding assistant with a customized initial prompt that includes:
- Your project goal
- Framework-specific context
- Best practices guidance
- Next steps to get started

The CLI detects which coding assistants are installed on your system and shows installed options first in the selection menu. Not installed assistants appear in gray with "(not installed)" but can still be selected.

You can also select **"None - I will prompt it myself"** if you prefer to manually launch your coding assistant later with the provided initial prompt.

## Development (for contributors)

```bash
# Clone the repo
git clone https://github.com/langwatch/better-agents
cd better-agents

# Install dependencies
pnpm install

# Run in development
pnpm dev init test-project

# Build
pnpm build
```

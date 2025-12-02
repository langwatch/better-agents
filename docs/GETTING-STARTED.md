# Getting Started

Get started with Better Agents in 2 minutes! 🚀

## Installation

```bash
npm install -g @langwatch/better-agents
```

Or use npx (no installation):

```bash
npx @langwatch/better-agents init my-agent
```

## Usage

```bash
better-agents init my-agent
```

Follow the prompts:

1. **Language**: Python or TypeScript
2. **Framework**: Agno (Python) or Mastra (TypeScript)
3. **Coding Assistant**: Claude Code, Cursor, Kilocode CLI, or None
4. **LLM Provider**: OpenAI, Anthropic, Gemini, Bedrock, OpenRouter, or Grok
5. **API Keys**: Your chosen LLM Provider API key and LangWatch API key
6. **Project Goal**: Describe what you want to build

## What You Get

```
my-agent/
├── app/ (or src/)           # Your agent code
├── prompts/                 # Versioned prompts
├── tests/
│   ├── evaluations/        # Performance evaluation notebooks
│   └── scenarios/          # End-to-end scenario tests
├── AGENTS.md               # Development guidelines
└── .mcp.json              # Coding assistant configuration
```

## Next Steps

```bash
cd my-agent
# Launch your coding assistant (it will be auto-launched after setup)
```

Your coding assistant is now an expert in:
- Your chosen framework (Agno/Mastra)
- LangWatch best practices
- Prompt management
- Agent testing

## Key Features

✅ **Agent Testing Pyramid** - Unit tests + Evals + Simulations
✅ **Prompt Management** - Version controlled prompts
✅ **MCP Integration** - Expert guidance built-in
✅ **Production Ready** - Best practices from day one

## Requirements

- Node.js 18+
- npm or pnpm
- A coding assistant (one of the following):
  - [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code-agent) (`claude` CLI)
  - [Cursor](https://www.cursor.com/)
  - [Kilocode CLI](https://www.kilocode.ai/) (`kilocode`)
- API Keys:
  - Your chosen LLM Provider API key
  - LangWatch API key (get one at https://app.langwatch.ai/authorize)

## Resources

- **Full Walkthrough**: [Walkthrough Guide](./walkthrough.md)
- **Dashboard**: https://app.langwatch.ai/
- **Scenario Docs**: https://scenario.langwatch.ai/

---

Questions? Open an issue on [GitHub](https://github.com/langwatch/better-agents)!

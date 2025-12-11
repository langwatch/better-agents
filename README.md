# Better Agents

<p>
    <a href="https://discord.gg/kT4PhDS2gH" target="_blank"><img src="https://img.shields.io/discord/1227886780536324106?logo=discord&labelColor=%20%235462eb&logoColor=%20%23f5f5f5&color=%20%235462eb" alt="chat on Discord"></a>
</p>

Better Agents is a CLI tool and a set of standards for agent building.

It supercharges your coding assistant (Kilocode, Claude Code, Cursor, etc), making it an expert in any agent framework you choose (Agno, Mastra, LangGraph etc) and all their best practices.

It's the best way to start any new agent project.

![](/images/cover-image.png)

The Better Agent Structure and generated AGENTS.md ensures industry best practices, making your agent ready for production:
- [Scenario](https://github.com/langwatch/scenario) agent tests written for every feature to ensure agent behaviour
- Versioning of the prompts for collaboration
- Evaluation notebooks for measuring specific prompts performance
- Already instrumented for full observability
- Standardization of structure for better project maintainability

## The Better Agent Structure

```
my-agent-project/
├── app/ (or src/)           # The actual agent code, according to the chosen framework
├── tests/
│   ├── evaluations/         # Jupyter notebooks for evaluations
│   │   └── example_eval.ipynb
│   └── scenarios/           # End-to-end scenario tests
│       └── example_scenario.test.{py,ts}
├── prompts/                 # Versioned prompt files for team collaboration
│   └── sample_prompt.yaml
├── prompts.json             # Prompt registry
├── .mcp.json                # MCP server configuration
├── AGENTS.md                # Development guidelines
├── .env                     # Environment variables
└── .gitignore
```

The structure and guidelines on `AGENTS.md` ensure every new feature required for the coding assistant is properly tested, evaluated, and that the prompts are versioned.

The `.mcp.json` comes with all the right MCPs set up so you coding assistant becomes an expert in your framework of choice and in writing Scenario tests for your agent.

[`scenarios/`](https://github.com/langwatch/scenario) tests guarantee the agent behaves as expected, which simulates a conversation with the agent making sure it does what expected.

[`evaluations/`](https://docs.langwatch.ai/llm-evaluation/offline/code/evaluation-api) notebooks holds dataset and notebooks for evaluating pieces of your agent pipeline such as a RAG or classification tasks it must do

Finally, [`prompts/`](https://docs.langwatch.ai/prompt-management/cli) hold all your versioned prompts in yaml format, synced and controlled by `prompts.json`, to allow for playground and team collaboration.

## Getting Started

### Installation

```bash
npm install -g @langwatch/better-agents
```

Or use with npx:

```bash
npx @langwatch/better-agents init my-agent-project
```

### Initialize a new project

```bash
# In current directory
better-agents init .

# In a new directory
better-agents init my-awesome-agent
```

```bash
# Non-interactive mode (pass all options; set API keys via env vars or .env)
LANGWATCH_API_KEY="sk-lw-..." OPENAI_API_KEY="sk-..." better-agents init ./my-agent \
  --language python \
  --framework agno \
  --llm-provider openai \
  --coding-assistant cursor \
  --goal "Build a trading agent"
```

For more provider-specific non-interactive examples, see `docs/USAGE.md`.

The CLI will guide you through selecting your programming language, agent framework, coding assistant, and LLM provider. Configuration flags come from CLI options; secrets (API keys) can come from environment variables (or a .env file you load).

## Documentation

- **[Getting Started](docs/GETTING-STARTED.md)** - Quick start guide (2 minutes)
- **[Walkthrough](docs/WALKTHROUGH.md)** - Detailed step-by-step guide
- **[Project Structure](docs/STRUCTURE.md)** - Understanding the Better Agent structure
- **[Features](docs/FEATURES.md)** - Key features and capabilities
- **[Usage](docs/USAGE.md)** - CLI usage and examples
- **[Philosophy](docs/PHILOSOPHY.md)** - Agent Testing Pyramid approach
- **[Contributing](docs/CONTRIBUTING.md)** - How to contribute to Better Agents
- **[Changelog](CHANGELOG.md)** - Version history

## Requirements

- Node.js 22+
- npm or pnpm
- A coding assistant (one of the following):
  - [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code-agent) (`claude` CLI)
  - [Cursor](https://www.cursor.com/)
  - [Antigravity](https://antigravity.google/) (`agy`)
  - [Kilocode CLI](https://www.kilocode.ai/) (`kilocode`)
- API Keys (provided via environment variables):
  - LangWatch API key (get one at https://app.langwatch.ai/authorize)
  - Your chosen LLM Provider API key

## Environment Variables

Better Agents uses environment variables for API keys. Set the following based on your chosen provider:

### Required for all projects
- `LANGWATCH_API_KEY` - Your LangWatch API key ([get it here](https://app.langwatch.ai/authorize))

### LLM Provider API Keys (choose based on `--llm-provider`)
- **OpenAI**: `OPENAI_API_KEY`
- **Anthropic**: `ANTHROPIC_API_KEY`
- **Gemini**: `GOOGLE_API_KEY` or `GEMINI_API_KEY`
- **AWS Bedrock**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (optional)
- **OpenRouter**: `OPENROUTER_API_KEY`
- **Grok**: `XAI_API_KEY`

### Coding Assistant Keys (only if needed)
- **gemini-cli**: `GEMINI_API_KEY`

### Examples

```bash
LANGWATCH_API_KEY="sk-lw-..." OPENAI_API_KEY="sk-..." better-agents init
```

For more provider-specific examples (Anthropic, Gemini, Bedrock, etc.), see the detailed usage guide in `docs/USAGE.md`.

## Resources

- [LangWatch](https://langwatch.ai)
- [Scenario Documentation](https://scenario.langwatch.ai/)
- [Agent Testing Pyramid](https://scenario.langwatch.ai/best-practices/the-agent-testing-pyramid)
- [Agno](https://agno.com)
- [Mastra](https://mastra.ai)
- [Discord](https://discord.com/invite/kT4PhDS2gH)

## License

MIT

---

Built with ❤️ by the LangWatch team

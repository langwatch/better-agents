# Philosophy

Better Agents promotes the **Agent Testing Pyramid** approach:

1. **Unit Tests** - Test deterministic components
2. **Evals & Optimization** - Measure and optimize probabilistic components
3. **Simulations** - End-to-end validation with Scenario

Learn more: https://scenario.langwatch.ai/best-practices/the-agent-testing-pyramid

## The Better Agent Structure

```
my-agent-project/
├── app/ (or src/)           # The actual agent code, structured according to the chosen framework
├── tests/
│   ├── evaluations/         # Jupyter notebooks for evaluations
│   │   └── example_eval.ipynb
│   └── scenarios/           # End-to-end scenario tests
│       └── example_scenario.test.{py,ts}
├── prompts/                 # Versioned prompt files for team collaboration
│   └── sample_prompt.yaml
├── prompts.json             # Prompt registry
├── .mcp.json                # MCP server configuration (universal)
├── .cursor/mcp.json         # Symlink to .mcp.json for Cursor
├── AGENTS.md                # Development guidelines
├── CLAUDE.md                # References AGENTS.md for Claude Code
├── .env                     # Environment variables
└── .gitignore
```

The structure and guidelines on `AGENTS.md` ensure every new feature required for the coding assistant is properly tested, evaluated, and that the prompts are versioned.

The `.mcp.json` comes with all the right MCPs set up so your coding assistant becomes an expert in your framework of choice and in writing Scenario tests for your agent. All AI coding editors are configured automatically - `.cursor/mcp.json` symlinks to the root config for Cursor, and `CLAUDE.md` references `AGENTS.md` for Claude Code.

[`scenarios/`](https://github.com/langwatch/scenario) tests guarantee the agent behaves as expected, which simulates a conversation with the agent making sure it does what expected.

`evaluations/` notebooks holds dataset and notebooks for evaluating pieces of your agent pipeline such as a RAG or classification tasks it must do

Finally, `prompts/` hold all your versioned prompts in yaml format, synced and controlled by `prompts.json`, to allow for playground and team collaboration.

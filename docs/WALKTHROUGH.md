# Better Agents Walkthrough

This guide walks you through creating your first agent project with Better Agents.

## Prerequisites

- Node.js 18 or higher
- An OpenAI API key
- A LangWatch API key (get one at https://app.langwatch.ai/authorize)
- Claude Code installed (optional, for coding assistant integration)

## Step 1: Install Better Agents

```bash
npm install -g @langwatch/better-agents
```

Or use with npx (no installation needed):

```bash
npx @langwatch/better-agents init my-stock-agent
```

## Step 2: Initialize Your Project

Let's create a stock analysis agent:

```bash
better-agents init my-stock-agent
```

You'll be prompted with:

### Question 1: Programming Language
```
? What programming language do you want to use?
❯ Python
  TypeScript
```
**Choose:** Python

### Question 2: Agent Framework
```
? What agent framework do you want to use?
❯ Agno
```
**Note:** Agno is the only option for Python (Mastra is for TypeScript)

### Question 3: Coding Assistant
```
? What coding assistant do you want to use?
❯ Claude Code
```

### Question 4: LLM Provider
```
? What LLM provider do you want to use?
❯ OpenAI
```

### Question 5: OpenAI API Key
```
? Enter your OpenAI API key: ********************************
```
**Enter your key** (it starts with `sk-`)

### Question 6: LangWatch API Key
```
To get your LangWatch API key, visit:
https://app.langwatch.ai/authorize

? Enter your LangWatch API key: ********************************
```
**Enter your key** (it starts with `sk-lw-`)

### Question 7: Project Goal
```
? What do you want to build?
```
**Example answer:** "Build an agent that can analyze stock prices and provide trading recommendations"

## Step 3: Project Setup Completes

You'll see:

```
✔ Setting up your agent project...
✨ Your agent project is ready!

Project location: /path/to/my-stock-agent

🤖 Starting your coding assistant...

Initial prompt:
"You are an expert AI agent developer. This project has been set up with LangWatch best practices.

First steps:
1. Read and understand the AGENTS.md file - it contains all the guidelines for this project
2. Update the AGENTS.md with specific details about what this project does
3. Create a comprehensive README.md explaining the project, setup, and usage
4. Set up the Python environment (requirements.txt)
5. Use the Agno MCP to learn about Agno best practices
6. Use the LangWatch MCP to learn about prompt management and testing
7. Start implementing the core agent functionality

Remember:
- ALWAYS use LangWatch Prompt CLI for prompts (ask the MCP how)
- ALWAYS write Scenario tests for new features (ask the MCP how)
- Follow the Agent Testing Pyramid methodology
- Test everything before considering it done

Project Goal: Build an agent that can analyze stock prices and provide trading recommendations"

To start Claude Code with this prompt, run:
  cd /path/to/my-stock-agent
  claude "You are an expert AI agent developer..."

Happy coding! 🚀
```

## Step 4: Explore Your Project Structure

Navigate to your project:

```bash
cd my-stock-agent
ls -la
```

You'll see:

```
my-stock-agent/
├── app/                          # Main application code
│   └── main.py
├── prompts/                      # Versioned prompt files
│   └── sample_prompt.yaml
├── tests/
│   ├── evaluations/             # Jupyter notebooks for evaluations
│   │   └── example_eval.ipynb
│   └── scenarios/               # Scenario tests
│       └── example_scenario.test.py
├── .mcp.json                    # MCP server configuration (universal)
├── .cursor/
│   └── mcp.json                 # Symlink to ../.mcp.json for Cursor
├── AGENTS.md                    # Development guidelines
├── CLAUDE.md                    # References AGENTS.md for Claude Code
├── .env                         # Your API keys (DO NOT COMMIT!)
├── .env.example                 # Template for API keys
├── .gitignore
└── prompts.json                 # Prompt registry
```

## Step 5: Read AGENTS.md

Open `AGENTS.md` to understand the guidelines:

```bash
cat AGENTS.md
```

This file contains:
- Project overview
- Core principles (Agent Testing Pyramid)
- Testing requirements
- Prompt management guidelines
- Framework-specific best practices
- Development workflow

## Step 6: Start Developing with Claude Code

```bash
claude "Build an agent that can analyze stock prices and provide trading recommendations"
```

Claude Code will:
1. Read AGENTS.md
2. Set up the Python environment
3. Learn from Agno MCP (ask it about Agno best practices)
4. Use LangWatch MCP for prompt management
5. Start building your agent with best practices

## What Happens Next?

### 1. Environment Setup
Claude Code will create:
```python
# requirements.txt
agno>=0.1.0
langwatch>=0.1.0
python-dotenv>=1.0.0
```

### 2. Prompt Creation
Using LangWatch Prompt CLI:
```yaml
# prompts/stock_analysis.yaml
model: gpt-4o
temperature: 0.7
messages:
  - role: system
    content: |
      You are a stock analysis expert...
```

### 3. Agent Implementation
```python
# app/main.py
from agno import Agent
import langwatch

# Agent code following Agno patterns...
```

### 4. Scenario Tests
```python
# tests/scenarios/stock_analysis.test.py
"""Test stock analysis agent scenarios"""

def test_analyze_stock():
    # Scenario test using LangWatch Scenario
    pass
```

### 5. Evaluations
```python
# tests/evaluations/stock_eval.ipynb
# Jupyter notebook evaluating:
# - Accuracy of stock recommendations
# - Response quality
# - Tool usage effectiveness
```

## Key Commands

### Running Your Agent
```bash
python app/main.py
```

### Running Tests
```bash
pytest tests/scenarios/
```

### Managing Prompts
```bash
langwatch prompts list
langwatch prompts push prompts/stock_analysis.yaml
```

### Viewing Traces
Visit: https://app.langwatch.ai/

## Best Practices Enforced

✅ **Prompt Versioning**: All prompts in `prompts/` directory
✅ **Testing**: Scenario tests for every feature
✅ **Evaluations**: Measure component performance
✅ **Agent Testing Pyramid**: Unit tests + Evals + Simulations
✅ **MCP Integration**: Expert guidance built-in
✅ **Framework Best Practices**: Agno patterns enforced

## Next Steps

1. **Implement Core Features**: Build your agent following AGENTS.md
2. **Write Tests**: Create scenario tests for each capability
3. **Create Evaluations**: Measure and optimize performance
4. **Iterate**: Use evaluations to improve your agent
5. **Deploy**: Your agent is production-ready!

## Getting Help

- **Ask LangWatch MCP**: "How do I [do something]?"
- **Consult Agno MCP**: Ask "How do I [do X] in Agno?"
- **Visit LangWatch Dashboard**: https://app.langwatch.ai/
- **Read Scenario docs**: https://scenario.langwatch.ai/

---

Congratulations! You now have a production-ready agent project with best practices baked in. 🚀


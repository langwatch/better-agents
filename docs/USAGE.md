# Usage

## Initialize a new project

Better Agents supports two modes of operation:

### Interactive Mode

```bash
better-agents init my-awesome-agent
```

### Non-Interactive Mode
Provide all configuration via CLI options and environment variables.

```bash
LANGWATCH_API_KEY="sk-lw-..." ANTHROPIC_API_KEY="sk-ant-..." better-agents init my-agent \
  --language python --framework agno --llm-provider anthropic \
  --coding-assistant cursor --goal "Build a trading agent"
```

The CLI configuration includes:

1. **Programming Language**: Python or TypeScript (`--language`)
2. **Agent Framework**: Agno, Mastra, LangGraph, Google ADK, Vercel AI (`--framework`)
3. **Coding Assistant**: Claude Code, Cursor, Antigravity, Kilocode CLI, or None (`--coding-assistant`)
4. **LLM Provider**: OpenAI, Anthropic, Gemini, Bedrock, OpenRouter, or Grok (`--llm-provider`)
5. **API Keys**: Provided via environment variables (see below)
6. **Project Goal**: What you want to build (`--goal`)

## Environment Variables

API keys are provided via environment variables, not CLI arguments. This follows security best practices and scales better with multiple providers.

### Required for All Projects
- `LANGWATCH_API_KEY` - Get it at https://app.langwatch.ai/authorize

### LLM Provider API Keys
Set the appropriate variable based on your `--llm-provider` choice:

| Provider | Environment Variable(s) | Get API Key |
|----------|------------------------|-------------|
| `openai` | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `anthropic` | `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| `gemini` | `GOOGLE_API_KEY` or `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey |
| `bedrock` | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (optional) | https://console.aws.amazon.com/iam/home#/security_credentials |
| `openrouter` | `OPENROUTER_API_KEY` | https://openrouter.ai/keys |
| `grok` | `XAI_API_KEY` | https://console.x.ai/team |

### Coding Assistant API Keys
Only required if using specific assistants:

| Assistant | Environment Variable | Get API Key |
|-----------|---------------------|-------------|
| `gemini-cli` | `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey |

## Examples

### Interactive Mode Examples

#### Python + Agno + OpenAI
```bash
LANGWATCH_API_KEY="sk-lw-..." OPENAI_API_KEY="sk-..." better-agents init trading-agent
# CLI will prompt for: language, framework, coding assistant, goal
```

#### TypeScript + Mastra + Anthropic
```bash
LANGWATCH_API_KEY="sk-lw-..." ANTHROPIC_API_KEY="sk-ant-..." better-agents init customer-support
# CLI will prompt for: language, framework, coding assistant, goal
```

#### AWS Bedrock
```bash
LANGWATCH_API_KEY="sk-lw-..." \
AWS_ACCESS_KEY_ID="AKIA..." \
AWS_SECRET_ACCESS_KEY="..." \
AWS_REGION="us-east-1" \
better-agents init my-agent
# CLI will prompt for: language, framework, coding assistant, goal
```

### Non-Interactive Mode Examples

#### Complete Python Project with Agno
```bash
LANGWATCH_API_KEY="sk-lw-..." OPENAI_API_KEY="sk-..." better-agents init trading-agent \
  --language python \
  --framework agno \
  --llm-provider openai \
  --coding-assistant cursor \
  --goal "Build an agent that can analyze stock prices and provide trading recommendations"
```

#### TypeScript + Mastra + Claude
```bash
LANGWATCH_API_KEY="sk-lw-..." ANTHROPIC_API_KEY="sk-ant-..." better-agents init customer-support \
  --language typescript \
  --framework mastra \
  --llm-provider anthropic \
  --coding-assistant claude-code \
  --goal "Build a customer support agent that can handle common queries and escalate complex issues"
```

#### LangGraph Python + Gemini
```bash
LANGWATCH_API_KEY="sk-lw-..." GOOGLE_API_KEY="..." better-agents init research-agent \
  --language python \
  --framework langgraph-py \
  --llm-provider gemini \
  --coding-assistant cursor \
  --goal "Build a research agent that can gather and summarize information from multiple sources"
```

#### AWS Bedrock Non-Interactive
```bash
LANGWATCH_API_KEY="sk-lw-..." \
AWS_ACCESS_KEY_ID="AKIA..." \
AWS_SECRET_ACCESS_KEY="..." \
better-agents init my-agent \
  --language typescript \
  --framework vercel-ai \
  --llm-provider bedrock \
  --aws-region us-west-2 \
  --coding-assistant cursor \
  --goal "Build a content generation agent"
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

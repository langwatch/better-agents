import { Command } from "commander";
import { initCommand } from "./commands/init";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { CLIOptions } from "./types.js";
import { validateCLIOptions } from "./utils/validate-cli-options.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

const program = new Command();

program
  .name("better-agents")
  .description(
    "CLI for kicking off production-ready agent projects with the Better Agents standard"
  )
  .version(packageJson.version)
  .option("-d, --debug", "Enable debug logging with structured JSON output");

program
  .command("init")
  .description(`Initialize a new agent project with telemetry and evaluation powered by LangWatch.

Environment variables (set before running):
  Required:
    LANGWATCH_API_KEY             Required for all projects
                                  (get one at: https://app.langwatch.ai/authorize)

  LLM provider (pick exactly one):
    openai                        OPENAI_API_KEY="sk-..."
    anthropic                     ANTHROPIC_API_KEY="sk-ant-..."
    gemini                        GOOGLE_API_KEY="..." or GEMINI_API_KEY="..."
    bedrock                       AWS_ACCESS_KEY_ID="..." +
                                  AWS_SECRET_ACCESS_KEY="..." [+ AWS_REGION="..."]
    openrouter                    OPENROUTER_API_KEY="sk-or-..."
    grok                          XAI_API_KEY="..."

  Optional (coding assistant specific):
    gemini-cli                    GEMINI_API_KEY="..." (only if using --coding-assistant gemini-cli)

Examples:
  # Minimal setup in current directory, interactive mode
    better-agents init

  # Python + Agno + Anthropic + Cursor in explicit path, non-interactive mode
  LANGWATCH_API_KEY="sk-lw-..." ANTHROPIC_API_KEY="sk-ant-..." \
    better-agents init . \
      --language python \
      --framework agno \
      --llm-provider anthropic \
      --coding-assistant cursor \
      --goal "Build a trading agent"

  # Bedrock with custom AWS region, non-interactive mode
  LANGWATCH_API_KEY="sk-lw-..." AWS_ACCESS_KEY_ID="..." AWS_SECRET_ACCESS_KEY="..." \
    better-agents init \
      --llm-provider bedrock \
      --aws-region us-west-2
`)
  .argument(
    "[path]",
    "Path to initialize the project (defaults to current directory)",
    "."
  )
  .option("--language <language>", "Programming language: python, typescript")
  .option("--framework <framework>", "Agent framework: agno, mastra, langgraph-py, langgraph-ts, google-adk, vercel-ai")
  .option("--llm-provider <provider>", "LLM provider: openai, anthropic, gemini, bedrock, openrouter, grok")
  .option("--coding-assistant <assistant>", "Coding assistant: claude-code, cursor, antigravity, kilocode, crush, gemini-cli, qwen-code, none")
  .option("--goal <goal>", "Project goal - what the agent should do")
  .option("--aws-region <region>", "AWS Region (for Bedrock provider)", "us-east-1")
  .action((path, options, command) => {
    // Get debug from parent command
    const debug = command.parent?.opts()?.debug || false;

    // Build CLI options object (API keys now come from environment variables)
    const cliOptions: CLIOptions = {
      language: options.language,
      framework: options.framework,
      llmProvider: options.llmProvider,
      codingAssistant: options.codingAssistant,
      goal: options.goal,
      awsRegion: options.awsRegion,
    };

    // Validate enum values upfront with helpful error messages
    try {
      validateCLIOptions(cliOptions);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`\n${error.message}\n`);
        process.exit(1);
      }
      throw error;
    }

    return initCommand(path, cliOptions, debug);
  });

program.parse();

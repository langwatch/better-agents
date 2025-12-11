import { Command } from "commander";
import { initCommand } from "./commands/init";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { CLIOptions } from "./types.js";

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
  .description("Initialize a new agent project")
  .argument(
    "[path]",
    "Path to initialize the project (defaults to current directory)",
    "."
  )
  .option("--language <language>", "Programming language (python, typescript)")
  .option("--framework <framework>", "Agent framework (agno, mastra, langgraph-py, langgraph-ts)")
  .option("--llm-provider <provider>", "LLM provider (openai, anthropic, gemini, bedrock, openrouter, grok)")
  .option("--llm-key <key>", "LLM API key")
  .option("--langwatch-key <key>", "LangWatch API key")
  .option("--coding-assistant <assistant>", "Coding assistant (claude-code, cursor, antigravity, kilocode, none)")
  .option("--goal <goal>", "Project goal - what the agent should do")
  .option("--aws-secret-key <key>", "AWS Secret Access Key (for Bedrock provider)")
  .option("--aws-region <region>", "AWS Region (for Bedrock provider)", "us-east-1")
  .option("-y, --yes", "Non-interactive mode (requires all options to be provided)")
  .action((path, options, command) => {
    // Get debug from parent command
    const debug = command.parent?.opts()?.debug || false;

    // Build CLI options object
    const cliOptions: CLIOptions = {
      language: options.language,
      framework: options.framework,
      llmProvider: options.llmProvider,
      llmKey: options.llmKey,
      langwatchKey: options.langwatchKey,
      codingAssistant: options.codingAssistant,
      goal: options.goal,
      awsSecretKey: options.awsSecretKey,
      awsRegion: options.awsRegion,
      yes: options.yes,
    };

    return initCommand(path, cliOptions, debug);
  });

program.parse();

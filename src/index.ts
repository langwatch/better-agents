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
  .description("Initialize a new agent project")
  .argument(
    "[path]",
    "Path to initialize the project (defaults to current directory)",
    "."
  )
  .option("--language <language>", "[required] Programming language: python, typescript")
  .option("--framework <framework>", "[required] Agent framework: agno, mastra, langgraph-py, langgraph-ts, google-adk, vercel-ai")
  .option("--llm-provider <provider>", "[required] LLM provider: openai, anthropic, gemini, bedrock, openrouter, grok")
  .option("--llm-key <key>", "[required] LLM API key (for Bedrock: use AWS Access Key ID)")
  .option("--langwatch-key <key>", "[required] LangWatch API key")
  .option("--coding-assistant <assistant>", "[required] Coding assistant: claude-code, cursor, antigravity, kilocode, crush, gemini-cli, qwen-code, none")
  .option("--goal <goal>", "[required] Project goal - what the agent should do")
  .option("--aws-secret-access-key <key>", "[optional] AWS Secret Access Key (required for Bedrock provider)")
  .option("--aws-region <region>", "[optional] AWS Region (for Bedrock provider)", "us-east-1")
  .option("--gemini-api-key <key>", "[optional] Gemini API key (required for gemini-cli coding assistant)")
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
      awsSecretAccessKey: options.awsSecretAccessKey,
      awsRegion: options.awsRegion,
      geminiApiKey: options.geminiApiKey,
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

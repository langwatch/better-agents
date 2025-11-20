import { Command } from "commander";
import { initCommand } from "./commands/init";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

const program = new Command();

program
  .name("better-agents")
  .description(
    "CLI for kicking off production-ready agent projects with LangWatch best practices"
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
  .action((path, options) => {
    // Pass debug option to init command (default to false if not provided)
    const debug = options.parent?.debug || false;
    return initCommand(path, debug);
  });

program.parse();

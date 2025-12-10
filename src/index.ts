import { Command } from "commander";
import { initCommand } from "./commands/init";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  initDistinctId,
  isAnalyticsEnabled,
  trackEventAndShutdown,
} from "./analytics/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

// Global start time for tracking duration on process exit
const globalStartTime = Date.now();

if (isAnalyticsEnabled()) {
  initDistinctId().catch(() => {
    // Ignore errors - will fallback to "anonymous"
  });
}

// Simple SIGINT handler - track cancellation and exit
let sigintHandled = false;
process.on("SIGINT", () => {
  if (sigintHandled) return;
  sigintHandled = true;

  console.log("\n"); // Clean line after ^C

  if (isAnalyticsEnabled()) {
    trackEventAndShutdown("cli_init_failed", {
      step: "cancelled",
      errorType: "SIGINT",
      durationSec: (Date.now() - globalStartTime) / 1000,
      success: false,
    }).finally(() => {
      process.exit(130);
    });
  } else {
    process.exit(130);
  }

  // Fallback exit after 2 seconds if tracking hangs
  setTimeout(() => {
    process.exit(130);
  }, 2000);
});

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
  .action((path, options) => {
    // Pass debug option to init command (default to false if not provided)
    const debug = options.parent?.debug || false;
    return initCommand(path, debug);
  });

program.parse();

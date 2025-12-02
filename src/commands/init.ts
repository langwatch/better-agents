import * as fs from "fs/promises";
import * as path from "path";
import { collectConfig } from "../config-collection/collect-config.js";
import { createProjectStructure } from "../project-scaffolding/create-project-structure.js";
import { getFrameworkProvider } from "../providers/frameworks/index.js";
import { buildAgentsGuide } from "../builders/agents-guide-builder.js";
import { buildMCPConfig } from "../builders/mcp-config-builder.js";
import { setupEditorConfigs } from "../builders/editor-setup-builder.js";
import { kickoffAssistant } from "../assistant-kickoff/kickoff-assistant.js";
import { LoggerFacade } from "../utils/logger/logger-facade.js";
import type { ProjectConfig } from "../types.js";

/**
 * Displays a static banner with ASCII art
 */
const showBanner = (): void => {
  const asciiArt =
    `
▗▄▄▖ ▗▄▄▄▖▗▄▄▄▖▗▄▄▄▖▗▄▄▄▖▗▄▄▖
▐▌ ▐▌▐▌     █    █  ▐▌   ▐▌ ▐▌
▐▛▀▚▖▐▛▀▀▘  █    █  ▐▛▀▀▘▐▛▀▚▖
▐▙▄▞▘▐▙▄▄▖  █    █  ▐▙▄▄▖▐▌ ▐▌

 ▗▄▖  ▗▄▄▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▄▄▖
▐▌ ▐▌▐▌   ▐▌   ▐▛▚▖▐▌  █ ▐▌
▐▛▀▜▌▐▌▝▜▌▐▛▀▀▘▐▌ ▝▜▌  █  ▝▀▚▖
▐▌ ▐▌▝▚▄▞▘▐▙▄▄▖▐▌  ▐▌  █ ▗▄▄▞▘

`;


  console.log(); // Empty line at top

  console.log(asciiArt);

  console.log(); // Empty line at bottom
};

/**
 * Initializes a new agent project with best practices.
 *
 * @param targetPath - Path where the project should be created (relative to cwd)
 * @param debug - Whether to enable debug logging
 * @returns Promise that resolves when initialization is complete
 *
 * @example
 * ```ts
 * await initCommand('my-agent-project');
 * await initCommand('my-agent-project', true); // with debug logging
 * ```
 */
export const initCommand = async (targetPath: string, debug = false): Promise<void> => {
  // Set debug environment variable for logger detection
  if (debug) {
    process.env.SUPERAGENTS_DEBUG = 'true';
  }

  // Create project-specific logger for debug logging
  const logger = new LoggerFacade();

  try {
    // Show banner
    showBanner();

    const configTimer = logger.startTimer('config-collection');
    const config: ProjectConfig = await collectConfig();
    configTimer();

    const absolutePath = path.resolve(process.cwd(), targetPath);

    // Create project-specific logger now that we have the path
    const projectLogger = new LoggerFacade(absolutePath);

    // Start spinner using logger's spinner management
    const spinner = projectLogger.startSpinner("Setting up your agent project...");

    try {
      projectLogger.info('init-started', {
        targetPath,
        absolutePath,
        config: {
          language: config.language,
          framework: config.framework,
          codingAssistant: config.codingAssistant,
          llmProvider: config.llmProvider,
          projectGoal: config.projectGoal.substring(0, 100) + '...' // Truncate for logging
        }
      });

      const mkdirTimer = projectLogger.startTimer('directory-creation');
      await fs.mkdir(absolutePath, { recursive: true });
      mkdirTimer();

      const structureTimer = projectLogger.startTimer('project-structure');
      await createProjectStructure({ projectPath: absolutePath, config });
      structureTimer();
      spinner.text = "Project structure created";

      // Set up framework-specific tools
      const frameworkTimer = projectLogger.startTimer('framework-setup');
      const frameworkProvider = getFrameworkProvider({
        framework: config.framework,
      });
      await frameworkProvider.setup({ projectPath: absolutePath });
      frameworkTimer();
      spinner.text = "Framework configuration set up";

      // Build MCP config and set up all editor configurations
      const editorTimer = projectLogger.startTimer('editor-setup');
      const mcpConfig = buildMCPConfig({ config });
      await setupEditorConfigs({ projectPath: absolutePath, mcpConfig });
      editorTimer();
      spinner.text = "Editor configurations set up";

      // Build AGENTS.md using builder
      const agentsTimer = projectLogger.startTimer('agents-guide');
      await buildAgentsGuide({ projectPath: absolutePath, config });
      agentsTimer();
      spinner.text = "AGENTS.md generated";

      spinner.succeed("Project setup complete!");

      projectLogger.userSuccess("Your agent project is ready!");
      projectLogger.userInfo(`Project location: ${absolutePath}`);

      projectLogger.info('init-completed', {
        projectPath: absolutePath,
        success: true
      });

      await kickoffAssistant({ projectPath: absolutePath, config });
    } catch (error) {
      spinner.fail("Failed to set up project");

      projectLogger.error(error as Error, {
        step: 'project-setup',
        projectPath: absolutePath
      });

      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.userError(`Error: ${error.message}`);
    } else {
      logger.userError("An unexpected error occurred");
    }
    process.exit(1);
  }
};

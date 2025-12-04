import { select, input, password, confirm } from "@inquirer/prompts";
import { spawn } from "child_process";
import type {
  ProjectConfig,
  AgentFramework,
  CodingAssistant,
  LLMProvider,
  ProgrammingLanguage,
  CLIOptions,
} from "../types.js";
import { logger } from "../utils/logger/index.js";
import { buildLanguageChoices } from "./choice-builders/language-choices.js";
import { buildFrameworkChoices } from "./choice-builders/framework-choices.js";
import { buildCodingAssistantChoices } from "./choice-builders/coding-assistant-choices.js";
import { getAllLLMProviders } from "../providers/llm-providers/index.js";
import { getAllCodingAssistants } from "../providers/coding-assistants/index.js";
import { validateOpenAIKey } from "./validators/openai-key.js";
import { validateLangWatchKey } from "./validators/langwatch-key.js";
import { validateProjectGoal } from "./validators/project-goal.js";

/**
 * Validates that all required options are provided for non-interactive mode.
 * @param options - CLI options to validate
 * @throws Error if required options are missing
 */
const validateNonInteractiveOptions = (options: CLIOptions): void => {
  const missing: string[] = [];

  if (!options.language) missing.push("--language");
  if (!options.framework) missing.push("--framework");
  if (!options.llmProvider) missing.push("--llm-provider");
  if (!options.llmKey) missing.push("--llm-key");
  if (!options.langwatchKey) missing.push("--langwatch-key");
  if (!options.codingAssistant) missing.push("--coding-assistant");
  if (!options.goal) missing.push("--goal");

  // Check for Bedrock-specific requirements
  if (options.llmProvider === "bedrock") {
    if (!options.awsSecretKey) missing.push("--aws-secret-key");
    if (!options.awsRegion) missing.push("--aws-region");
  }

  if (missing.length > 0) {
    throw new Error(
      `Non-interactive mode (--yes) requires all options. Missing: ${missing.join(", ")}`
    );
  }
};

/**
 * Validates framework is compatible with language.
 * @param language - Selected programming language
 * @param framework - Selected framework
 * @throws Error if framework is incompatible with language
 */
const validateFrameworkLanguage = (
  language: ProgrammingLanguage,
  framework: AgentFramework
): void => {
  const pythonFrameworks: AgentFramework[] = ["agno", "langgraph-py"];
  const typescriptFrameworks: AgentFramework[] = ["mastra", "langgraph-ts"];

  if (language === "python" && !pythonFrameworks.includes(framework)) {
    throw new Error(
      `Framework "${framework}" is not compatible with Python. Use: ${pythonFrameworks.join(", ")}`
    );
  }

  if (language === "typescript" && !typescriptFrameworks.includes(framework)) {
    throw new Error(
      `Framework "${framework}" is not compatible with TypeScript. Use: ${typescriptFrameworks.join(", ")}`
    );
  }
};

/**
 * Collects project configuration from user via interactive CLI prompts,
 * or uses provided CLI options for non-interactive mode.
 *
 * @param cliOptions - Optional CLI options for non-interactive mode
 * @returns Promise resolving to complete ProjectConfig
 *
 * @example
 * ```ts
 * // Interactive mode
 * const config = await collectConfig();
 *
 * // Non-interactive mode
 * const config = await collectConfig({
 *   language: 'python',
 *   framework: 'agno',
 *   llmProvider: 'anthropic',
 *   llmKey: 'sk-ant-...',
 *   langwatchKey: 'sk-lw-...',
 *   codingAssistant: 'claude-code',
 *   goal: 'Build an agent that...',
 *   yes: true
 * });
 * ```
 */
export const collectConfig = async (
  cliOptions: CLIOptions = {}
): Promise<ProjectConfig> => {
  try {
    // If --yes flag is set, validate all required options are provided
    if (cliOptions.yes) {
      validateNonInteractiveOptions(cliOptions);

      // Validate framework/language compatibility
      validateFrameworkLanguage(cliOptions.language!, cliOptions.framework!);

      // Build additional inputs for providers that need them (e.g., Bedrock)
      let llmAdditionalInputs: Record<string, string> | undefined;
      if (cliOptions.llmProvider === "bedrock") {
        llmAdditionalInputs = {
          awsSecretKey: cliOptions.awsSecretKey!,
          awsRegion: cliOptions.awsRegion!,
        };
      }

      // Return config directly without prompts
      return {
        language: cliOptions.language!,
        framework: cliOptions.framework!,
        codingAssistant: cliOptions.codingAssistant!,
        llmProvider: cliOptions.llmProvider!,
        llmApiKey: cliOptions.llmKey!,
        llmAdditionalInputs,
        langwatchApiKey: cliOptions.langwatchKey!,
        projectGoal: cliOptions.goal!,
      };
    }

    // Interactive mode - prompt for missing values
    logger.userInfo(
      "Setting up your agent project following the Better Agent Structure.\n"
    );

    // Language - use CLI option or prompt
    const language: ProgrammingLanguage = cliOptions.language || await select({
      message: "What programming language do you want to use?",
      choices: buildLanguageChoices(),
    });

    // Framework - use CLI option or prompt
    const framework: AgentFramework = cliOptions.framework || await select<AgentFramework>({
      message: "What agent framework do you want to use?",
      choices: buildFrameworkChoices({ language }),
    });

    // Validate if both were provided via CLI
    if (cliOptions.language && cliOptions.framework) {
      validateFrameworkLanguage(language, framework);
    }

    // LLM Provider - use CLI option or prompt
    const allProviders = getAllLLMProviders();
    const llmProvider: LLMProvider = cliOptions.llmProvider || await select<LLMProvider>({
      message: "What LLM provider is your agent going to use?",
      choices: allProviders.map((p) => ({
        name: p.displayName,
        value: p.id as LLMProvider,
      })),
    });

    const selectedProvider = allProviders.find((p) => p.id === llmProvider);
    const providerDisplayName = selectedProvider?.displayName || llmProvider;

    // LLM API Key - use CLI option or prompt
    let llmApiKey: string;
    if (cliOptions.llmKey) {
      llmApiKey = cliOptions.llmKey;
    } else {
      if (selectedProvider?.apiKeyUrl) {
        logger.userInfo(`To get your ${providerDisplayName} API key, visit:`);
        logger.userInfo(`${selectedProvider.apiKeyUrl}`);
      }

      llmApiKey = await password({
        message: `Enter your ${providerDisplayName} API key:`,
        mask: "*",
        validate:
          llmProvider === "openai"
            ? validateOpenAIKey
            : (value) => {
                if (!value || value.length < 5) {
                  return "API key is required and must be at least 5 characters";
                }
                return true;
              },
      });
    }

    // Collect additional credentials if the provider needs them
    let llmAdditionalInputs: Record<string, string> | undefined;
    if (
      selectedProvider?.additionalCredentials &&
      selectedProvider.additionalCredentials.length > 0
    ) {
      llmAdditionalInputs = {};

      for (const credential of selectedProvider.additionalCredentials) {
        // Check if value was provided via CLI (for Bedrock)
        if (credential.key === "awsSecretKey" && cliOptions.awsSecretKey) {
          llmAdditionalInputs[credential.key] = cliOptions.awsSecretKey;
          continue;
        }
        if (credential.key === "awsRegion" && cliOptions.awsRegion) {
          llmAdditionalInputs[credential.key] = cliOptions.awsRegion;
          continue;
        }

        // Otherwise prompt
        if (credential.type === "password") {
          llmAdditionalInputs[credential.key] = await password({
            message: `Enter your ${credential.label}:`,
            mask: "*",
            validate: credential.validate,
          });
        } else {
          llmAdditionalInputs[credential.key] = await input({
            message: `Enter your ${credential.label}:`,
            default: credential.defaultValue,
            validate: credential.validate,
          });
        }
      }
    }

    // Coding Assistant - use CLI option or prompt
    const codingAssistant: CodingAssistant = cliOptions.codingAssistant || await select<CodingAssistant>({
      message:
        "What is your preferred coding assistant for building the agent?",
      choices: await buildCodingAssistantChoices(),
    });

    // Check if the selected coding assistant is available (skip in non-interactive parts)
    if (!cliOptions.codingAssistant) {
      const codingAssistantProviders = getAllCodingAssistants();
      const selectedCodingProvider = codingAssistantProviders.find(
        (p) => p.id === codingAssistant
      );

      if (selectedCodingProvider) {
        let availability = await selectedCodingProvider.isAvailable();
        if (!availability.installed && availability.installCommand) {
          logger.userWarning(
            `${selectedCodingProvider.displayName} is not installed.`
          );
          logger.userInfo(`To install it, run:`);
          logger.userInfo(`${availability.installCommand}`);

          const shouldInstall = await confirm({
            message: "Would you like me to install it for you?",
            default: true,
          });

          if (shouldInstall) {
            logger.userInfo("Installing...");
            try {
              await new Promise<void>((resolve, reject) => {
                const [cmd, ...args] = availability.installCommand!.split(" ");
                const child = spawn(cmd, args, { stdio: "inherit" });

                child.on("close", (code: number) => {
                  if (code === 0) {
                    resolve();
                  } else {
                    reject(
                      new Error(`Installation failed with exit code ${code}`)
                    );
                  }
                });

                child.on("error", reject);
              });

              // Check availability again after installation
              availability = await selectedCodingProvider.isAvailable();
              if (availability.installed) {
                logger.userSuccess(
                  `${selectedCodingProvider.displayName} installed successfully!`
                );
              } else {
                logger.userError(
                  "Installation may have failed. Please try installing manually."
                );
              }
            } catch (error) {
              logger.userError(
                `Installation failed: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`
              );
              logger.userInfo("Please try installing manually.");
            }
          }
        }
      }

      logger.userInfo("✔︎ Your coding assistant will finish setup later if needed\n");
    }

    // LangWatch API Key - use CLI option or prompt
    let langwatchApiKey: string;
    if (cliOptions.langwatchKey) {
      langwatchApiKey = cliOptions.langwatchKey;
    } else {
      logger.userInfo("To get your LangWatch API key, visit:");
      logger.userInfo("https://app.langwatch.ai/authorize");

      langwatchApiKey = await password({
        message:
          "Enter your LangWatch API key (for prompt management, scenarios, evaluations and observability):",
        mask: "*",
        validate: validateLangWatchKey,
      });
    }

    // Project Goal - use CLI option or prompt
    const projectGoal: string = cliOptions.goal || await input({
      message: "What is your agent going to do?",
      validate: validateProjectGoal,
    });

    return {
      language,
      framework,
      codingAssistant,
      llmProvider,
      llmApiKey,
      llmAdditionalInputs,
      langwatchApiKey,
      projectGoal,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("User force closed")) {
      logger.userWarning("Setup cancelled by user");
      process.exit(0);
    }
    throw error;
  }
};

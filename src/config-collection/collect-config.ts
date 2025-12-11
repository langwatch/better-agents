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
import {
  isNonInteractiveMode,
  validateNonInteractiveOptions,
} from "../utils/validate-cli-options.js";

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
  const pythonFrameworks: AgentFramework[] = ["agno", "langgraph-py", "google-adk"];
  const typescriptFrameworks: AgentFramework[] = ["mastra", "langgraph-ts", "vercel-ai"];

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
 * Non-interactive mode is automatically detected when all required options are provided.
 *
 * @param cliOptions - Optional CLI options for non-interactive mode
 * @returns Promise resolving to complete ProjectConfig
 *
 * @example
 * ```ts
 * // Interactive mode
 * const config = await collectConfig();
 *
 * // Non-interactive mode (automatically detected)
 * const config = await collectConfig({
 *   language: 'python',
 *   framework: 'agno',
 *   llmProvider: 'anthropic',
 *   llmKey: 'sk-ant-...',
 *   langwatchKey: 'sk-lw-...',
 *   codingAssistant: 'claude-code',
 *   goal: 'Build an agent that...'
 * });
 * ```
 */
export const collectConfig = async (
  cliOptions: CLIOptions = {}
): Promise<ProjectConfig> => {
  try {
    // Auto-detect non-interactive mode: if all required options are provided, skip prompts
    if (isNonInteractiveMode(cliOptions)) {
      validateNonInteractiveOptions(cliOptions);

      // Validate framework/language compatibility
      validateFrameworkLanguage(cliOptions.language!, cliOptions.framework!);

      // Read API keys from environment variables
      const langwatchApiKey = process.env.LANGWATCH_API_KEY;
      if (!langwatchApiKey) {
        throw new Error(
          `Missing required environment variable: LANGWATCH_API_KEY\n\n` +
          `When using Better Agents, you must set the LANGWATCH_API_KEY environment variable.\n\n` +
          `Get your LangWatch API key at: https://app.langwatch.ai/authorize`
        );
      }

      // Get LLM provider-specific API key from environment
      const allProviders = getAllLLMProviders();
      let llmApiKey: string;
      let llmAdditionalInputs: Record<string, string> | undefined;

      if (cliOptions.llmProvider === "openai") {
        llmApiKey = process.env.OPENAI_API_KEY || "";
        if (!llmApiKey) {
          throw new Error(
            `Missing required environment variable: OPENAI_API_KEY. See 'better-agents init --help' for setup.`
          );
        }
      } else if (cliOptions.llmProvider === "anthropic") {
        llmApiKey = process.env.ANTHROPIC_API_KEY || "";
        if (!llmApiKey) {
          throw new Error(
            `Missing required environment variable: ANTHROPIC_API_KEY. See 'better-agents init --help' for setup.`
          );
        }
      } else if (cliOptions.llmProvider === "gemini") {
        llmApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
        if (!llmApiKey) {
          throw new Error(
            `Missing required environment variable: GOOGLE_API_KEY or GEMINI_API_KEY. See 'better-agents init --help' for setup.`
          );
        }
      } else if (cliOptions.llmProvider === "bedrock") {
        llmApiKey = process.env.AWS_ACCESS_KEY_ID || "";
        const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
        const awsRegion = process.env.AWS_REGION || cliOptions.awsRegion || "us-east-1";
        
        if (!llmApiKey || !awsSecretAccessKey) {
          const missing = [];
          if (!llmApiKey) missing.push("AWS_ACCESS_KEY_ID");
          if (!awsSecretAccessKey) missing.push("AWS_SECRET_ACCESS_KEY");
          throw new Error(
            `Missing required environment variable(s): ${missing.join(", ")}. See 'better-agents init --help' for setup.`
          );
        }
        
        llmAdditionalInputs = {
          awsSecretAccessKey,
          awsRegion,
        };
      } else if (cliOptions.llmProvider === "openrouter") {
        llmApiKey = process.env.OPENROUTER_API_KEY || "";
        if (!llmApiKey) {
          throw new Error(
            `Missing required environment variable: OPENROUTER_API_KEY. See 'better-agents init --help' for setup.`
          );
        }
      } else if (cliOptions.llmProvider === "grok") {
        llmApiKey = process.env.XAI_API_KEY || "";
        if (!llmApiKey) {
          throw new Error(
            `Missing required environment variable: XAI_API_KEY. See 'better-agents init --help' for setup.`
          );
        }
      } else {
        throw new Error(`Unknown LLM provider: ${cliOptions.llmProvider}`);
      }

      // Check for Gemini API key if using gemini-cli coding assistant
      if (cliOptions.codingAssistant === "gemini-cli") {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
          throw new Error(
            `Missing required environment variable: GEMINI_API_KEY. See 'better-agents init --help' for setup.`
          );
        }
      }

      // Return config directly without prompts
      return {
        language: cliOptions.language!,
        framework: cliOptions.framework!,
        codingAssistant: cliOptions.codingAssistant!,
        llmProvider: cliOptions.llmProvider!,
        llmApiKey,
        llmAdditionalInputs,
        langwatchApiKey,
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

    // LLM API Key - check environment variable first, then prompt
    let llmApiKey: string | undefined;
    
    // Check for provider-specific env var
    if (llmProvider === "openai") {
      llmApiKey = process.env.OPENAI_API_KEY;
    } else if (llmProvider === "anthropic") {
      llmApiKey = process.env.ANTHROPIC_API_KEY;
    } else if (llmProvider === "gemini") {
      llmApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    } else if (llmProvider === "bedrock") {
      llmApiKey = process.env.AWS_ACCESS_KEY_ID;
    } else if (llmProvider === "openrouter") {
      llmApiKey = process.env.OPENROUTER_API_KEY;
    } else if (llmProvider === "grok") {
      llmApiKey = process.env.XAI_API_KEY;
    }

    // If not found in env, prompt for it
    if (!llmApiKey) {
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
        // Check environment variables first
        if (credential.key === "awsSecretAccessKey") {
          const envValue = process.env.AWS_SECRET_ACCESS_KEY;
          if (envValue) {
            llmAdditionalInputs[credential.key] = envValue;
            continue;
          }
        }
        if (credential.key === "awsRegion") {
          const envValue = process.env.AWS_REGION || cliOptions.awsRegion;
          if (envValue) {
            llmAdditionalInputs[credential.key] = envValue;
            continue;
          }
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

    // LangWatch API Key - check environment variable first, then prompt
    let langwatchApiKey = process.env.LANGWATCH_API_KEY;
    
    if (!langwatchApiKey) {
      logger.userInfo("To get your LangWatch API key, visit:");
      logger.userInfo("https://app.langwatch.ai/authorize");

      langwatchApiKey = await password({
        message:
          "Enter your LangWatch API key (for prompt management, scenarios, evaluations and observability):",
        mask: "*",
        validate: validateLangWatchKey,
      });
    }

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

    // Check for Gemini API key if using Gemini CLI
    if (codingAssistant === "gemini-cli") {
      if (!process.env.GEMINI_API_KEY) {
        logger.userInfo("When using Gemini CLI, you must specify the GEMINI_API_KEY environment variable.");
        logger.userInfo("Get your Gemini API key at: https://aistudio.google.com/app/apikey");
        const geminiApiKey = await password({
          message: "Enter your Gemini API key:",
          mask: "*",
          validate: (value) => {
            if (!value || value.length < 5) {
              return "API key is required and must be at least 5 characters";
            }
            return true;
          },
        });
        process.env.GEMINI_API_KEY = geminiApiKey;
        logger.userInfo("GEMINI_API_KEY has been set for this session.");
      }
    }

    logger.userInfo("✔︎ Your coding assistant will finish setup later if needed\n");

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

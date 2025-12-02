import { select, input, password, confirm } from "@inquirer/prompts";
import { spawn } from "child_process";
import type {
  ProjectConfig,
  AgentFramework,
  CodingAssistant,
  LLMProvider,
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
 * Collects project configuration from user via interactive CLI prompts.
 *
 * @returns Promise resolving to complete ProjectConfig
 *
 * @example
 * ```ts
 * const config = await collectConfig();
 * // Returns: { language: 'python', framework: 'agno', ... }
 * ```
 */
export const collectConfig = async (): Promise<ProjectConfig> => {
  try {
    logger.userInfo(
      "Setting up your agent project following the Better Agent Structure.\n"
    );

    const language = await select({
      message: "What programming language do you want to use?",
      choices: buildLanguageChoices(),
    });

    const framework = await select<AgentFramework>({
      message: "What agent framework do you want to use?",
      choices: buildFrameworkChoices({ language }),
    });

    const allProviders = getAllLLMProviders();
    const llmProvider = await select<LLMProvider>({
      message: "What LLM provider is your agent going to use?",
      choices: allProviders.map((p) => ({
        name: p.displayName,
        value: p.id as LLMProvider,
      })),
    });

    const selectedProvider = allProviders.find((p) => p.id === llmProvider);
    const providerDisplayName = selectedProvider?.displayName || llmProvider;

    if (selectedProvider?.apiKeyUrl) {
      logger.userInfo(`To get your ${providerDisplayName} API key, visit:`);
      logger.userInfo(`${selectedProvider.apiKeyUrl}`);
    }

    const llmApiKey = await password({
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

    // Collect additional credentials if the provider needs them
    let llmAdditionalInputs: Record<string, string> | undefined;
    if (
      selectedProvider?.additionalCredentials &&
      selectedProvider.additionalCredentials.length > 0
    ) {
      llmAdditionalInputs = {};

      for (const credential of selectedProvider.additionalCredentials) {
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

    const codingAssistant = await select<CodingAssistant>({
      message:
        "What is your preferred coding assistant for building the agent?",
      choices: await buildCodingAssistantChoices(),
    });

    // Check if the selected coding assistant is available
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
        } else {
          // Empty line for spacing - no logging needed
        }
      }
    }

    logger.userInfo("✔︎ Your coding assistant will finish setup later if needed\n");

    logger.userInfo("To get your LangWatch API key, visit:");
    logger.userInfo("https://app.langwatch.ai/authorize");

    const langwatchApiKey = await password({
      message:
        "Enter your LangWatch API key (for prompt management, scenarios, evaluations and observability):",
      mask: "*",
      validate: validateLangWatchKey,
    });

    const projectGoal = await input({
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

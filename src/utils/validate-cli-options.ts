import type {
  CLIOptions,
  ProgrammingLanguage,
  AgentFramework,
  CodingAssistant,
  LLMProvider,
} from "../types.js";

/**
 * Valid values for each enum type
 */
const VALID_LANGUAGES: readonly ProgrammingLanguage[] = ["python", "typescript"];
const VALID_FRAMEWORKS: readonly AgentFramework[] = [
  "agno",
  "mastra",
  "langgraph-py",
  "langgraph-ts",
];
const VALID_CODING_ASSISTANTS: readonly CodingAssistant[] = [
  "claude-code",
  "cursor",
  "antigravity",
  "kilocode",
  "none",
];
const VALID_LLM_PROVIDERS: readonly LLMProvider[] = [
  "openai",
  "anthropic",
  "gemini",
  "bedrock",
  "openrouter",
  "grok",
];

/**
 * Validates CLI option enum values and provides helpful error messages.
 *
 * @param options - CLI options to validate
 * @throws Error with helpful message if any value is invalid
 *
 * @example
 * ```ts
 * validateCLIOptions({ language: 'java' }); // Throws with valid options listed
 * validateCLIOptions({ language: 'python' }); // OK
 * ```
 */
export const validateCLIOptions = (options: CLIOptions): void => {
  const errors: string[] = [];

  // Validate language
  if (
    options.language &&
    !VALID_LANGUAGES.includes(options.language as ProgrammingLanguage)
  ) {
    errors.push(
      `Invalid --language "${options.language}". Valid options: ${VALID_LANGUAGES.join(", ")}`
    );
  }

  // Validate framework
  if (
    options.framework &&
    !VALID_FRAMEWORKS.includes(options.framework as AgentFramework)
  ) {
    errors.push(
      `Invalid --framework "${options.framework}". Valid options: ${VALID_FRAMEWORKS.join(", ")}`
    );
  }

  // Validate coding assistant
  if (
    options.codingAssistant &&
    !VALID_CODING_ASSISTANTS.includes(options.codingAssistant as CodingAssistant)
  ) {
    errors.push(
      `Invalid --coding-assistant "${options.codingAssistant}". Valid options: ${VALID_CODING_ASSISTANTS.join(", ")}`
    );
  }

  // Validate LLM provider
  if (
    options.llmProvider &&
    !VALID_LLM_PROVIDERS.includes(options.llmProvider as LLMProvider)
  ) {
    errors.push(
      `Invalid --llm-provider "${options.llmProvider}". Valid options: ${VALID_LLM_PROVIDERS.join(", ")}`
    );
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

/**
 * Checks if all required options are provided for non-interactive mode.
 *
 * @param options - CLI options to check
 * @returns true if all required options are provided (auto non-interactive mode)
 *
 * @example
 * ```ts
 * isNonInteractiveMode({ language: 'python' }); // false - incomplete
 * isNonInteractiveMode({ language: 'python', framework: 'agno', ... }); // true if all provided
 * ```
 */
export const isNonInteractiveMode = (options: CLIOptions): boolean => {
  // Check core required fields
  const hasRequiredFields =
    !!options.language &&
    !!options.framework &&
    !!options.llmProvider &&
    !!options.llmKey &&
    !!options.langwatchKey &&
    !!options.codingAssistant &&
    !!options.goal;

  // If not all required fields, definitely interactive
  if (!hasRequiredFields) {
    return false;
  }

  // If Bedrock provider, also need AWS Secret Access Key
  // (llmKey is used as AWS Access Key ID for Bedrock)
  if (options.llmProvider === "bedrock") {
    return !!options.awsSecretAccessKey;
  }

  return true;
};

/**
 * Validates that all required options are provided for non-interactive mode.
 *
 * @param options - CLI options to validate
 * @throws Error with list of missing options if incomplete
 *
 * @example
 * ```ts
 * validateNonInteractiveOptions({ language: 'python' }); // Throws listing missing options
 * ```
 */
export const validateNonInteractiveOptions = (options: CLIOptions): void => {
  const missing: string[] = [];

  if (!options.language) missing.push("--language");
  if (!options.framework) missing.push("--framework");
  if (!options.llmProvider) missing.push("--llm-provider");
  if (!options.llmKey) missing.push("--llm-key");
  if (!options.langwatchKey) missing.push("--langwatch-key");
  if (!options.codingAssistant) missing.push("--coding-assistant");
  if (!options.goal) missing.push("--goal");

  // Check for Bedrock-specific requirements
  // Note: --llm-key is used as AWS Access Key ID for Bedrock
  if (options.llmProvider === "bedrock") {
    if (!options.awsSecretAccessKey) missing.push("--aws-secret-access-key");
  }

  if (missing.length > 0) {
    throw new Error(
      `Non-interactive mode requires all options. Missing: ${missing.join(", ")}`
    );
  }
};


export type ProgrammingLanguage = 'python' | 'typescript';
export type AgentFramework =
  | 'agno'
  | 'mastra'
  | 'langgraph-py'
  | 'langgraph-ts'
  | 'google-adk'
  | 'vercel-ai';
export type CodingAssistant =
  | 'claude-code'
  | 'cursor'
  | 'kilocode'
  | 'antigravity'
  | 'gemini-cli'
  | 'crush'
  | 'qwen-code'
  | 'none';
export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'bedrock' | 'openrouter' | 'grok';

export type ProjectConfig = {
  language: ProgrammingLanguage;
  framework: AgentFramework;
  codingAssistant: CodingAssistant;
  llmProvider: LLMProvider;
  llmApiKey: string;
  llmAdditionalInputs?: Record<string, string>;
  langwatchApiKey: string;
  projectGoal: string;
};

/**
 * CLI options for non-interactive mode.
 * When these are provided, the corresponding prompts are skipped.
 * If all required options are provided, the CLI automatically runs in non-interactive mode.
 */
export type CLIOptions = {
  language?: ProgrammingLanguage;
  framework?: AgentFramework;
  codingAssistant?: CodingAssistant;
  llmProvider?: LLMProvider;
  goal?: string;
  /** AWS Region for Bedrock provider (optional configuration, not a credential) */
  awsRegion?: string;
};


export type ProgrammingLanguage = 'python' | 'typescript';
export type AgentFramework = 'agno' | 'mastra' | 'langgraph-py' | 'langgraph-ts';
export type CodingAssistant = 'claude-code' | 'cursor' | 'kilocode' | 'none';
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


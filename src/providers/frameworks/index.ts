import type { ProgrammingLanguage } from "../../types.js";
import { AgnoFrameworkProvider } from "./agno/index.js";
import { MastraFrameworkProvider } from "./mastra/index.js";

export type MCPServerConfig =
  | {
      type?: "stdio";
      command: string;
      args: string[];
    }
  | {
      type: "http";
      transport: string;
      url: string;
    };

export type FrameworkKnowledge = {
  /** Prompt instruction for setup tooling (e.g. "TypeScript w/pnpm + vitest") */
  setupInstructions: string;
  /** Prompt instruction for accessing docs (e.g. "Use the Mastra MCP...") */
  toolingInstructions: string;
  /** Full markdown section for AGENTS.md */
  agentsGuideSection: string;
};

/**
 * Interface for framework-specific providers.
 * Each framework implements setup, knowledge, and optional MCP configuration.
 *
 * @example
 * ```ts
 * const provider = getFrameworkProvider('mastra');
 * await provider.setup({ projectPath: '/path/to/project' });
 * const knowledge = provider.getKnowledge();
 * ```
 */
export interface FrameworkProvider {
  /** Unique identifier (e.g. "agno", "mastra") */
  readonly id: string;
  /** Display name for UI (e.g. "Agno") */
  readonly displayName: string;
  /** Supported language */
  readonly language: ProgrammingLanguage;

  /** Returns framework-specific knowledge for documentation */
  getKnowledge(): FrameworkKnowledge;

  /** Returns MCP server configuration if available */
  getMCPConfig?(): MCPServerConfig | null;

  /** Performs framework-specific setup (files, downloads, etc.) */
  setup(params: { projectPath: string }): Promise<void>;
}

const PROVIDERS: Record<string, FrameworkProvider> = {
  agno: AgnoFrameworkProvider,
  mastra: MastraFrameworkProvider,
};

/**
 * Gets a framework provider by ID.
 *
 * @param params - Parameters object
 * @param params.framework - Framework identifier
 * @returns Framework provider instance
 *
 * @example
 * ```ts
 * const provider = getFrameworkProvider({ framework: 'mastra' });
 * ```
 */
export const getFrameworkProvider = ({
  framework,
}: {
  framework: string;
}): FrameworkProvider => {
  const provider = PROVIDERS[framework];
  if (!provider) {
    throw new Error(`Framework provider not found: ${framework}`);
  }
  return provider;
};

/**
 * Gets all frameworks available for a given language.
 *
 * @param params - Parameters object
 * @param params.language - The programming language
 * @returns Array of framework providers
 *
 * @example
 * ```ts
 * const frameworks = getFrameworksByLanguage({ language: 'python' });
 * ```
 */
export const getFrameworksByLanguage = ({
  language,
}: {
  language: ProgrammingLanguage;
}): FrameworkProvider[] => {
  return Object.values(PROVIDERS).filter((p) => p.language === language);
};

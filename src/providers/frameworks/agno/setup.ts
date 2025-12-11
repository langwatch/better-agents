import type { ProjectConfig } from "../../../types.js";

/**
 * Performs Agno-specific setup.
 * Agno uses MCP for documentation, no additional setup files needed.
 *
 * @param _params - Parameters object (unused)
 * @returns Promise that resolves immediately
 *
 * @example
 * ```ts
 * await setup({ projectPath: '/path/to/project', config });
 * ```
 */
export const setup = async (_params: { projectPath: string; config: ProjectConfig }): Promise<void> => {
  // Agno uses MCP for documentation - no additional setup files needed
};

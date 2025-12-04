import type { ProjectConfig } from "../../types.js";
import { getFrameworkProvider } from "../../providers/frameworks/index.js";

/**
 * Builds framework-specific guidelines section for AGENTS.md.
 *
 * @param params - Parameters object
 * @param params.config - Project configuration
 * @returns Markdown string for framework guidelines section
 *
 * @example
 * ```ts
 * const section = buildFrameworkSection({ config });
 * ```
 */
export const buildFrameworkSection = ({
  config,
}: {
  config: ProjectConfig;
}): string => {
  const frameworkProvider = getFrameworkProvider({
    framework: config.framework,
  });
  return frameworkProvider.getKnowledge({ config }).agentsGuideSection;
};

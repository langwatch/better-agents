import * as fs from "fs/promises";
import * as path from "path";
import type { ProjectConfig } from "../types.js";
import { getFrameworkProvider } from "../providers/frameworks/index.js";
import { buildOverviewSection } from "../documentation/sections/overview-section.js";
import { buildPrinciplesSection } from "../documentation/sections/principles-section.js";
import { buildWorkflowSection } from "../documentation/sections/workflow-section.js";

/**
 * Builds and writes AGENTS.md using provider knowledge.
 *
 * @param params - Parameters object
 * @param params.projectPath - Absolute path to project root
 * @param params.config - Project configuration
 * @returns Promise that resolves when file is written
 *
 * @example
 * ```ts
 * await buildAgentsGuide({ projectPath: '/path/to/project', config });
 * ```
 */
export const buildAgentsGuide = async ({
  projectPath,
  config,
}: {
  projectPath: string;
  config: ProjectConfig;
}): Promise<void> => {
  const frameworkProvider = getFrameworkProvider({
    framework: config.framework,
  });
  const frameworkKnowledge = frameworkProvider.getKnowledge({ config });

  const content = [
    buildOverviewSection({ config }),
    buildPrinciplesSection(),
    frameworkKnowledge.agentsGuideSection,
    buildWorkflowSection({ config }),
  ].join("\n");

  await fs.writeFile(path.join(projectPath, "AGENTS.md"), content);
};


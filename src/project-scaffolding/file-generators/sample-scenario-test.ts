import * as fs from "fs/promises";
import * as path from "path";
import type { ProgrammingLanguage } from "../../types.js";

/**
 * Generates sample scenario test file in tests/scenarios/.
 *
 * @param params - Parameters object
 * @param params.projectPath - Absolute path to project root
 * @param params.language - Programming language (python or typescript)
 * @returns Promise that resolves when file is written
 *
 * @example
 * ```ts
 * await generateSampleScenario({ projectPath: '/path', language: 'typescript' });
 * ```
 */
export const generateSampleScenario = async ({
  projectPath,
  language,
}: {
  projectPath: string;
  language: ProgrammingLanguage;
}): Promise<void> => {
  const fileName =
    language === "python"
      ? "test_example_scenario.py"
      : "example_scenario.test.ts";
  const sampleScenarioContent =
    language === "python"
      ? `"""
Sample scenario test for your agent.
Follow the Agent Testing Pyramid: use Scenario for end-to-end agentic tests.
"""

# TODO: Add your scenario tests here
# Refer to https://scenario.langwatch.ai/ for documentation
`
      : `/**
 * Sample scenario test for your agent.
 * Follow the Agent Testing Pyramid: use Scenario for end-to-end agentic tests.
 */

// TODO: Add your scenario tests here
// Refer to https://scenario.langwatch.ai/ for documentation
`;

  await fs.writeFile(
    path.join(
      projectPath,
      "tests",
      "scenarios",
      fileName
    ),
    sampleScenarioContent
  );
};

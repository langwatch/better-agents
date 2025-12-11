import type { ProjectConfig } from '../../types.js';

/**
 * Builds the project overview section for AGENTS.md.
 *
 * @param params - Parameters object
 * @param params.config - Project configuration
 * @returns Markdown string for overview section
 *
 * @example
 * ```ts
 * const section = buildOverviewSection({ config });
 * ```
 */
export const buildOverviewSection = ({ config }: { config: ProjectConfig }): string => {
  const { projectGoal, framework, language } = config;

  return `# Agent Development Guidelines

## Project Overview

**Goal:** ${projectGoal}

**Framework:** ${
  framework === 'agno'
    ? 'Agno'
    : framework === 'langgraph-py'
    ? 'LangGraph (Python)'
    : framework === 'langgraph-ts'
    ? 'LangGraph (TypeScript)'
    : framework === 'google-adk'
    ? 'Google ADK'
    : 'Mastra'
}
**Language:** ${language === 'python' ? 'Python' : 'TypeScript'}

This project follows the Better Agents standard for building production-ready AI agents.

---
`;
};


import * as fs from "fs/promises";
import * as path from "path";
import type { MCPConfigFile } from "../providers/coding-assistants/index.js";

/**
 * Sets up all AI coding editor configurations for the project.
 * This centralizes editor setup so all editors work regardless of which one the user chooses.
 *
 * Creates:
 * - `.mcp.json` - Root MCP config (universal standard, used by Claude Code, Kilocode, etc.)
 * - `.cursor/mcp.json` - Symlink to root `.mcp.json` for Cursor compatibility
 * - `CLAUDE.md` - References AGENTS.md for Claude Code
 *
 * @param params - Parameters object
 * @param params.projectPath - Absolute path to project root
 * @param params.mcpConfig - MCP configuration to write
 * @returns Promise that resolves when all editor configs are written
 *
 * @example
 * ```ts
 * await setupEditorConfigs({
 *   projectPath: '/path/to/project',
 *   mcpConfig: { mcpServers: { langwatch: { command: 'npx', args: ['-y', '@langwatch/mcp-server'] } } }
 * });
 * ```
 */
export const setupEditorConfigs = async ({
  projectPath,
  mcpConfig,
}: {
  projectPath: string;
  mcpConfig: MCPConfigFile;
}): Promise<void> => {
  // 1. Write root .mcp.json (universal standard)
  const mcpConfigPath = path.join(projectPath, ".mcp.json");
  await fs.writeFile(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));

  // 2. Create .cursor directory and symlink to root .mcp.json
  const cursorDir = path.join(projectPath, ".cursor");
  await fs.mkdir(cursorDir, { recursive: true });
  const cursorMcpPath = path.join(cursorDir, "mcp.json");

  // Create relative symlink from .cursor/mcp.json -> ../.mcp.json
  try {
    // Remove existing file/symlink if it exists
    await fs.unlink(cursorMcpPath).catch(() => {});
    await fs.symlink("../.mcp.json", cursorMcpPath);
  } catch {
    // Fallback: if symlink fails (e.g., Windows without admin), copy the file
    await fs.writeFile(cursorMcpPath, JSON.stringify(mcpConfig, null, 2));
  }

  // 3. Create CLAUDE.md that references AGENTS.md for Claude Code
  const claudeMdPath = path.join(projectPath, "CLAUDE.md");
  const claudeMdContent = `@AGENTS.md\n`;
  await fs.writeFile(claudeMdPath, claudeMdContent);
};


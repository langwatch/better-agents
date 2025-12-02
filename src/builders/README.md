# Builders

This directory contains builders that construct configuration files and content for the generated projects.

## Overview

Builders are responsible for creating the artifacts that make up a Better Agents project. They work together with providers to generate framework-specific and editor-specific configurations.

## Files

### `mcp-config-builder.ts`

Builds the MCP (Model Context Protocol) configuration object. This includes:

- LangWatch MCP server (always included)
- Framework-specific MCP servers (e.g., Mastra MCP for TypeScript projects)

**Note**: This builder only constructs the config object. Writing the files is handled by `editor-setup-builder.ts`.

### `editor-setup-builder.ts`

Sets up all AI coding editor configurations for the project. This centralizes editor setup so all editors work regardless of which one the user chooses during init.

Creates:

- `.mcp.json` - Root MCP config (universal standard, used by Claude Code, Kilocode, etc.)
- `.cursor/mcp.json` - Symlink to root `.mcp.json` for Cursor IDE compatibility
- `CLAUDE.md` - References `AGENTS.md` for Claude Code

### `agents-guide-builder.ts`

Builds the `AGENTS.md` file which contains development guidelines including:

- Project overview
- Framework-specific guidelines
- LangWatch best practices
- Agent Testing Pyramid methodology
- Workflow instructions

## Architecture

```
                    ┌─────────────────┐
                    │   init.ts       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ buildMCPConfig│  │ setupEditorConfigs│ │ buildAgentsGuide    │
│ (returns obj) │──│ (writes files)    │ │ (writes AGENTS.md)  │
└───────────────┘  └─────────────────┘  └─────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   .mcp.json         .cursor/mcp.json      CLAUDE.md
                      (symlink)
```


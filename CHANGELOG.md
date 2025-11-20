# Changelog

All notable changes to Better Agents will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4-beta.0](https://github.com/langwatch/better-agents/compare/v0.1.3-beta.0...v0.1.4-beta.0) (2025-11-20)


### Features

* add markdown issue templates and enforce conventional commits ([#25](https://github.com/langwatch/better-agents/issues/25)) ([b03bd02](https://github.com/langwatch/better-agents/commit/b03bd0224c032a4f863cf54d07e7857d55febc33)), closes [#23](https://github.com/langwatch/better-agents/issues/23)

## [0.1.3-beta.0](https://github.com/langwatch/better-agents/compare/v0.1.2-beta.0...v0.1.3-beta.0) (2025-11-20)


### Bug Fixes

* **ci:** correct workflow config for single package structure ([aada6b1](https://github.com/langwatch/better-agents/commit/aada6b17abf01be682a191ce27677f9291940f89))

## [0.1.2-beta.0](https://github.com/langwatch/better-agents/compare/v0.1.1-beta.0...v0.1.2-beta.0) (2025-11-20)


### Bug Fixes

* resolve pnpm version mismatch in publish workflow ([c279fb7](https://github.com/langwatch/better-agents/commit/c279fb7e1c80d940e3b3af88e7b371d5f8df0c43))

## [0.1.1-beta.0](https://github.com/langwatch/better-agents/compare/v0.1.0-beta.0...v0.1.1-beta.0) (2025-11-18)


### Features

* add ASCII art banner to init command ([785efd4](https://github.com/langwatch/better-agents/commit/785efd4046bd12bf6b01cda91fdd95833a6b88ea))
* add Cursor CLI and Kilocode CLI support with auto-launch ([ee739fb](https://github.com/langwatch/better-agents/commit/ee739fb7ad3dc7bba8378028a9d2aacca155a951))
* add ESLint with automatic unused import removal ([1564be7](https://github.com/langwatch/better-agents/commit/1564be7b8b25382e57443b43759721516d4ece02))
* add release please ([#26](https://github.com/langwatch/better-agents/issues/26)) ([7cbec8f](https://github.com/langwatch/better-agents/commit/7cbec8fa8f14ed2f795cb0099a4e9ac096ba29aa))
* add smithery, super agent man, improve instructions further ([80d2e3b](https://github.com/langwatch/better-agents/commit/80d2e3bcc287e0757db82ba3a494e093fd2a2948))
* add support for multiple LLM providers (Anthropic, Gemini, Bedrock, OpenRouter, Grok) ([7effefa](https://github.com/langwatch/better-agents/commit/7effefaccadafee7511234f811c6ce39d61234ff))
* add tsup build configuration for CLI publishing ([c94e197](https://github.com/langwatch/better-agents/commit/c94e197bafbc26ea73fca7b41537dbadb8f578f8))
* add tsup build configuration for CLI publishing ([#20](https://github.com/langwatch/better-agents/issues/20)) ([ba383b2](https://github.com/langwatch/better-agents/commit/ba383b24e03af51a96d3a35af2f6018eab5642a4))
* add unified logging for debug logs and standard user logging ([#28](https://github.com/langwatch/better-agents/issues/28)) ([99a8c4a](https://github.com/langwatch/better-agents/commit/99a8c4a52b88193e4216e21a20182a31ee839636))
* add unified logging for debug logs and standard user logging ([#30](https://github.com/langwatch/better-agents/issues/30)) ([f31da71](https://github.com/langwatch/better-agents/commit/f31da71c40c3830d031f29e1796b1b9a4911f0f5)), closes [#27](https://github.com/langwatch/better-agents/issues/27)
* add unified logging system with Pino ([74d8f29](https://github.com/langwatch/better-agents/commit/74d8f29a319aa403fc3007b17e398736ca49da68))
* always create timestamped debug log files ([21b448a](https://github.com/langwatch/better-agents/commit/21b448aea7115ef592f4c8afae2a03d17a066cf4))
* create CLAUDE.md file for Claude Code projects ([739e3bc](https://github.com/langwatch/better-agents/commit/739e3bc6d09459d0e6b8f6d01624daad43018118))
* implement E2E test for TypeScript + Claude + Mastra flow ([9ec5d6f](https://github.com/langwatch/better-agents/commit/9ec5d6f59502b9315e43e8768ae4a6f142957d9e))
* implement global unified logging across codebase ([37c541c](https://github.com/langwatch/better-agents/commit/37c541ccd2032a20de98c9901f6d97460464c3a3))
* **init:** add animated rainbow banner with horizontal color bands ([f39aac1](https://github.com/langwatch/better-agents/commit/f39aac1ee897da42be29953f49408dc8b5977853))
* **llm-providers:** add API key URLs for all providers during init flow ([7702051](https://github.com/langwatch/better-agents/commit/77020515f138d4040109870c3c7a7cfc5b7737a2))
* offer automatic installation for missing coding assistants ([fd0dd64](https://github.com/langwatch/better-agents/commit/fd0dd64a30aa6cba4bcdfb20eb476073c746e6ad))


### Bug Fixes

* better instructions ([7440973](https://github.com/langwatch/better-agents/commit/7440973cf3e84c8b228ed7f8c7dc695782a72687))
* better rules ([72d3886](https://github.com/langwatch/better-agents/commit/72d38867ddf89ea8972519f69cd15b8702b8bf71))
* correct typo in ASCII art banner (AGEENTS -&gt; AGENTS) ([50970ef](https://github.com/langwatch/better-agents/commit/50970efe951c1aa03d70f0bb001707725ff6fd2a))
* improve initial instructions, and mcp server does not need api key anymore ([17183ef](https://github.com/langwatch/better-agents/commit/17183efdf3bf277e4c1859dc2e7b075cafd5b266))
* improve instructions and change kilocode to automode ([e6fa558](https://github.com/langwatch/better-agents/commit/e6fa55844d50fedc36f79784435f84a3f26104e7))
* improve principles further ([5c84ed7](https://github.com/langwatch/better-agents/commit/5c84ed755294b18f2ae83395940c6d4402ee7bfb))
* use execSync for proper terminal control handover ([7077d63](https://github.com/langwatch/better-agents/commit/7077d63afd521d2cdfe90168c338aee7cda2071d))


### Miscellaneous

* .gitignore local files ([3938e2d](https://github.com/langwatch/better-agents/commit/3938e2d4fb59b7410f76a50ef2a2ea417fe9311e))
* add coding guidelines ([3e4dbc2](https://github.com/langwatch/better-agents/commit/3e4dbc26ff4448515e3ce0b087ed10520ff12016))
* add new rule for commit and push ([992156e](https://github.com/langwatch/better-agents/commit/992156ef6bca56af5c6d8f21ddac853176b02e22))
* add unit testing guidelines ([045151f](https://github.com/langwatch/better-agents/commit/045151fb0a3808d72eb69ae2940578062ad2c492))
* better name ([#32](https://github.com/langwatch/better-agents/issues/32)) ([1f6a420](https://github.com/langwatch/better-agents/commit/1f6a42046bc149cfa603d6261bd65f776cecc187)), closes [#31](https://github.com/langwatch/better-agents/issues/31)
* fix lint ([eb644d1](https://github.com/langwatch/better-agents/commit/eb644d1b1b647a27427c8ca1785b774519fb9f6b))
* lint ([9795f8c](https://github.com/langwatch/better-agents/commit/9795f8c370a8d59dfb20a4282601d84dfdd44d63))
* new spec stories ([93ded10](https://github.com/langwatch/better-agents/commit/93ded1044f3ddd5097bc0a66974cf0fa7dff00c5))
* update pnpm lock ([8e3aa8e](https://github.com/langwatch/better-agents/commit/8e3aa8e9e3546c23ede08e513899747de701c0a6))


### Documentation

* add links to docs for evals and prompts ([a5e74a2](https://github.com/langwatch/better-agents/commit/a5e74a23cf0532bdaa4e282bc6901922016a84a2))
* improve readme and few renamings left ([fa861ea](https://github.com/langwatch/better-agents/commit/fa861eae6f11b98fd928e97091c7a566e0e086cb))
* remove unused generated md files ([7c3207f](https://github.com/langwatch/better-agents/commit/7c3207f25dfa178ca3382d070b7d26ce222ac2a9))


### Code Refactoring

* complete utility namespacing and import standardization ([87c3982](https://github.com/langwatch/better-agents/commit/87c3982f5b45fb33f469632f6748dfa79d0f7860))
* implement facade pattern for logger architecture ([039b0c2](https://github.com/langwatch/better-agents/commit/039b0c2d30e0c9efd110f62c30dabb7448d8f060))
* implement provider-based architecture to eliminate conditionals ([dc768f6](https://github.com/langwatch/better-agents/commit/dc768f68edcb435f098e352a1139be1658371c8d))
* implement provider-based architecture to eliminate conditionals ([fdbf4e6](https://github.com/langwatch/better-agents/commit/fdbf4e68be86f6e00fbe034b2260c2cc8542b7ab))
* namespace utility functions and standardize imports ([7a4c358](https://github.com/langwatch/better-agents/commit/7a4c3585d997a086314b04a5898f5cd2a3124416))
* namespace utility functions and standardize imports ([#24](https://github.com/langwatch/better-agents/issues/24)) ([0424e01](https://github.com/langwatch/better-agents/commit/0424e016f5a6e1f5a39ff7d897acafaaf7ac5778)), closes [#23](https://github.com/langwatch/better-agents/issues/23)
* reorganize codebase into feature-based architecture ([70dcc0d](https://github.com/langwatch/better-agents/commit/70dcc0dfa25a23151dfb81ac653acc6a62fd537c))
* reorganize codebase into feature-based architecture ([10a7b46](https://github.com/langwatch/better-agents/commit/10a7b46dd53d253078c4b08f4d4607bd8b0855e9))
* reorganize codebase into feature-based architecture  ([70dcc0d](https://github.com/langwatch/better-agents/commit/70dcc0dfa25a23151dfb81ac653acc6a62fd537c))
* simplify process launch with spawnSync ([a084874](https://github.com/langwatch/better-agents/commit/a08487407e00ae14ad1230bea518bf56623f2dc5))

## [0.1.0] - 2025-11-07

### Added
- Initial release of Better Agents CLI
- Interactive project initialization with `better-agents init`
- Support for Python and TypeScript projects
- Integration with Agno framework (Python)
- Integration with Mastra framework (TypeScript)
- Claude Code coding assistant support
- OpenAI LLM provider support
- LangWatch integration for:
  - Prompt management via Prompt CLI
  - Scenario-based testing
  - Evaluation notebooks
- MCP (Model Context Protocol) configuration for:
  - LangWatch MCP server
  - Mastra MCP server (for TypeScript projects)
  - Agno .cursorrules and llms.txt (for Python projects)
- Standardized project structure with:
  - Source directory (`app/` or `src/`)
  - `prompts/` directory for versioned prompts
  - `tests/evaluations/` for Jupyter notebooks
  - `tests/scenarios/` for scenario tests
- Comprehensive AGENTS.md file with:
  - Framework-specific guidelines
  - Agent Testing Pyramid methodology
  - LangWatch best practices
  - Development workflow instructions
- Environment variable management with `.env` files
- Automatic `.gitignore` generation
- Sample files and templates for quick start

### Documentation
- Comprehensive README with usage examples
- CONTRIBUTING guide for developers
- MIT License
- Example project structures

[0.1.0]: https://github.com/langwatch/better-agents/releases/tag/v0.1.0

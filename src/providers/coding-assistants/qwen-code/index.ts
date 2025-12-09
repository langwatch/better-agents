import { CliUtils } from '../../../utils/cli.util.js';
import { logger } from '../../../utils/logger/index.js';
import type { CodingAssistantProvider } from '../index.js';

/**
 * Alibaba Qwen Code CLI coding assistant provider.
 * Reference: https://github.com/QwenLM/qwen-code
 */
export const QwenCodeCodingAssistantProvider: CodingAssistantProvider = {
  id: 'qwen-code',
  displayName: 'Qwen Code',
  command: 'qwen',

  async isAvailable() {
    const installed = await CliUtils.isCommandAvailable("qwen");
    return {
      installed,
      installCommand: installed ? undefined : 'npm install -g @qwenlm/qwen-code',
    };
  },

  async launch({ targetPath }) {
    // Always show manual instructions - never auto-launch Qwen Code
    const isCurrentDir = targetPath === '.';

    logger.userPlain('');
    logger.userPlain('To get started with Qwen Code:');
    logger.userPlain('');

    if (isCurrentDir) {
      logger.userPlain('  Run:');
      logger.userPlain('');
      logger.userPlain('    qwen');
    } else {
      logger.userPlain('  Navigate to project and run:');
      logger.userPlain('');
      logger.userPlain(`    cd ${targetPath}`);
      logger.userPlain('    qwen');
    }

    logger.userPlain('');
    logger.userPlain('  Then paste the prompt above when Qwen Code starts.');
    logger.userPlain('');
  },

};

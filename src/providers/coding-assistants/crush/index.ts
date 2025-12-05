import { logger } from '../../../utils/logger/index.js';
import type { CodingAssistantProvider } from '../index.js';

/**
 * Crush CLI coding assistant provider.
 * Reference: https://github.com/charmbracelet/crush
 */
export const CrushCodingAssistantProvider: CodingAssistantProvider = {
  id: 'crush',
  displayName: 'Crush',
  command: 'crush',

  async isAvailable() {
    return {
      installed: true,
      installCommand: 'npm install -g @charmland/crush',
    };
  },

  async launch({ targetPath }) {
    // Always show manual instructions - never auto-launch Crush
    const isCurrentDir = targetPath === '.';

    logger.userPlain('');
    logger.userPlain('💘 Launch Crush');
    logger.userPlain('');
    
    if (isCurrentDir) {
      logger.userPlain('  Run:');
      logger.userPlain('');
      logger.userPlain('    crush');
    } else {
      logger.userPlain('  Navigate to project and run via the following commands:');
      logger.userPlain('');
      logger.userPlain(`    cd ${targetPath}`);
      logger.userPlain('    crush');
    }
    
    logger.userPlain('');
    logger.userPlain('  Then paste the prompt above when Crush starts.');
    logger.userPlain('');
  },

};

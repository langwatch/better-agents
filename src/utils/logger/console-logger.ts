import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';
import type { LogContext } from './types.js';

/**
 * Console logger responsible for debug output to console.
 *
 * This class handles pretty-printed console output for debug mode,
 * separate from file logging and user-facing display logging.
 *
 * @example
 * ```ts
 * const logger = new ConsoleLogger();
 * logger.info('step-completed', { duration: 150 });
 * ```
 */
export class ConsoleLogger {
  private pinoLogger: PinoLogger | undefined;

  /**
   * Creates a new console logger instance.
   */
  constructor() {
    // Only enable console transport when debug mode is detected
    if (this.detectDebugMode()) {
      this.pinoLogger = pino({
        level: "debug",
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      });
    }
  }

  /**
   * Detects if debug mode is enabled via environment variable or CLI flag.
   */
  private detectDebugMode(): boolean {
    return Boolean(
      process.env.BETTERAGENTS_DEBUG ||
      process.argv.includes("--debug") ||
      process.argv.includes("-d")
    );
  }

  /**
   * Logs debug information to console in pretty format.
   * @param step - The operation or step being logged
   * @param context - Additional structured data for debugging
   */
  debug(step: string, context: LogContext = {}): void {
    this.pinoLogger?.debug({ step, ...context });
  }

  /**
   * Logs informational debug data to console in pretty format.
   * @param step - The operation or step being logged
   * @param context - Additional structured data for analysis
   */
  info(step: string, context: LogContext = {}): void {
    this.pinoLogger?.info({ step, ...context });
  }

  /**
   * Logs error with stack trace to console in pretty format.
   * @param error - The error that occurred
   * @param context - Additional context about the error
   */
  error(error: Error, context: LogContext = {}): void {
    this.pinoLogger?.error({
      step: 'error',
      error: error.message,
      stack: error.stack,
      ...context
    });
  }

  /**
   * Checks if console logging is enabled.
   * @returns True if debug mode console logging is active
   */
  isEnabled(): boolean {
    return this.pinoLogger !== undefined;
  }
}

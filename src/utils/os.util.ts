import * as os from "node:os";

/**
 * Utility class for OS-related operations.
 */
export class OSUtils {
  /**
   * Checks if we're running on a Unix platform (Mac/Linux/WSL).
   *
   * @returns true if running on Unix platform, false otherwise
   *
   * @example
   * ```ts
   * if (OSUtils.isUnix) {
   *   // Unix-specific code
   * }
   * ```
   */
  static get isUnix(): boolean {
    return os.platform() !== "win32";
  }

  /**
   * Checks if we're running on macOS.
   *
   * @returns true if running on macOS, false otherwise
   *
   * @example
   * ```ts
   * if (OSUtils.isMac) {
   *   // macOS-specific code
   * }
   * ```
   */
  static get isMac(): boolean {
    return os.platform() === "darwin";
  }
}


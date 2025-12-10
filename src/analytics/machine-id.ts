import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

const BETTER_AGENTS_DIR = ".better-agents";
const MACHINE_ID_FILE = "machine-id";

/**
 * Gets the path to the Better Agents config directory.
 *
 * @returns Absolute path to ~/.better-agents
 */
const getConfigDir = (): string => {
  return join(homedir(), BETTER_AGENTS_DIR);
};

/**
 * Gets the path to the machine ID file.
 *
 * @returns Absolute path to ~/.better-agents/machine-id
 */
const getMachineIdPath = (): string => {
  return join(getConfigDir(), MACHINE_ID_FILE);
};

/**
 * Gets or creates an anonymous machine ID for analytics.
 * The ID is a UUID v4 stored in ~/.better-agents/machine-id.
 * This ensures consistent identification across CLI runs without collecting PII.
 *
 * @returns Promise resolving to the machine's unique ID
 * @throws Error if unable to read or create the machine ID file
 *
 * @example
 * ```ts
 * const machineId = await getOrCreateMachineId();
 * // Returns something like "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export const getOrCreateMachineId = async (): Promise<string> => {
  const machineIdPath = getMachineIdPath();

  try {
    // Try to read existing machine ID
    const existingId = await readFile(machineIdPath, "utf-8");
    const trimmedId = existingId.trim();
    if (trimmedId) {
      return trimmedId;
    }
  } catch {
    // File doesn't exist or can't be read - will create new one
  }

  // Generate new machine ID
  const newId = randomUUID();

  try {
    // Ensure config directory exists
    await mkdir(getConfigDir(), { recursive: true });

    // Write the new machine ID
    await writeFile(machineIdPath, newId, "utf-8");
  } catch {
    // If we can't write, still return the generated ID for this session
    // It just won't persist
  }

  return newId;
};


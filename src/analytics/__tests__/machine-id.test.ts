import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdir, writeFile, rm } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

describe("machine-id", () => {
  // Use a unique test directory to avoid conflicts
  const testHomeDir = join(homedir(), ".better-agents-test-" + process.pid);
  const testConfigDir = join(testHomeDir, ".better-agents");
  const testMachineIdPath = join(testConfigDir, "machine-id");

  beforeEach(async () => {
    // Reset module cache to get fresh imports
    vi.resetModules();

    // Mock os.homedir to return our test directory
    vi.doMock("os", async () => {
      const actual = await vi.importActual<typeof import("os")>("os");
      return {
        ...actual,
        homedir: () => testHomeDir,
      };
    });

    // Clean up test directory before each test
    try {
      await rm(testHomeDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  afterEach(async () => {
    vi.resetModules();
    vi.restoreAllMocks();

    // Clean up after tests
    try {
      await rm(testHomeDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  describe("getOrCreateMachineId", () => {
    it("creates a new UUID when no machine-id file exists", async () => {
      const { getOrCreateMachineId } = await import("../machine-id.js");

      const machineId = await getOrCreateMachineId();

      // Should be a valid UUID v4 format
      expect(machineId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("returns existing machine-id if file exists", async () => {
      const existingId = "existing-test-id-12345";

      // Create the directory and file manually using the mocked path
      await mkdir(testConfigDir, { recursive: true });
      await writeFile(testMachineIdPath, existingId, "utf-8");

      const { getOrCreateMachineId } = await import("../machine-id.js");

      const machineId = await getOrCreateMachineId();
      expect(machineId).toBe(existingId);
    });

    it("returns consistent ID across multiple calls in same session", async () => {
      const { getOrCreateMachineId } = await import("../machine-id.js");

      const firstId = await getOrCreateMachineId();
      const secondId = await getOrCreateMachineId();

      expect(firstId).toBe(secondId);
    });

    it("generates valid UUID v4", async () => {
      const { getOrCreateMachineId } = await import("../machine-id.js");

      const machineId = await getOrCreateMachineId();

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where y is 8, 9, a, or b
      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(machineId).toMatch(uuidV4Regex);
    });
  });
});

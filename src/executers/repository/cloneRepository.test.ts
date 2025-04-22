import { describe, it, expect, vi } from "vitest";
import { cloneRepository } from "./cloneRepository";
import fs from "fs";
import path from "path";

describe("cloneRepository", () => {
  const createTempDir = () => {
    const tempDir = path.join(
      "node_modules/.endpoints-tmp",
      `${new Date().getTime()}`,
    );
    fs.mkdirSync(tempDir, { recursive: true });
    return tempDir;
  };

  const removeTempDir = (dir: string) => {
    fs.rmSync(dir, { recursive: true, force: true });
  };

  it("should clone the repository and return the cache path", () => {
    const sshPath = "https://github.com/matsuri-tech/endpoints-sdk-cli.git";
    vi.useFakeTimers();
    const cachePath = createTempDir();

    const result = cloneRepository(sshPath, undefined);

    expect(result).toBe(cachePath);
    removeTempDir(cachePath);
  });

  it("should throw an error if the repository is not found", () => {
    const wrongSshPath = "--quiet wrong-github.com";

    expect(() => cloneRepository(wrongSshPath, undefined)).toThrowError();
  });

  it("should clone the repository with workspace and return the cache path", () => {
    const sshPath = "https://github.com/matsuri-tech/endpoints-sdk-cli.git";
    const workspace = "example";
    vi.useFakeTimers();
    const cachePath = createTempDir();

    const result = cloneRepository(sshPath, workspace);

    expect(result).toBe(cachePath);
    removeTempDir(cachePath);
  });
});

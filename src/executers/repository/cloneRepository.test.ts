import { describe, it, expect, vi } from "vitest";
import { cloneRepository } from "./cloneRepository";

describe("cloneRepository", () => {
  it("should clone the repository and return the cache path", () => {
    const sshPath = "https://github.com/matsuri-tech/endpoints-sdk-cli.git";
    vi.useFakeTimers();
    const cachePath = `node_modules/.endpoints-tmp/${new Date().getTime()}`;

    const result = cloneRepository(sshPath);

    expect(result).toBe(cachePath);
  });

  it("should throw an error if the repository is not found", () => {
    const wrongSshPath = "--quiet wrong-github.com";

    expect(() => cloneRepository(wrongSshPath)).toThrowError();
  });
});

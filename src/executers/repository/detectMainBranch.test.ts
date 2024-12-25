import { describe, it, expect } from "vitest";
import { detectMainBranch } from "./detectMainBranch";

describe("detectMainBranch", () => {
  it("should return the current branch name", () => {
    const repositoryPath = "./";

    const result = detectMainBranch(repositoryPath);

    expect(result).toBeTruthy();
  });

  it("should handle errors gracefully", () => {
    const repositoryPath = "/path/to/repo";

    expect(() => detectMainBranch(repositoryPath)).toThrowError();
  });
});

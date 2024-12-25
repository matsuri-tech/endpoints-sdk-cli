import { describe, it, expect } from "vitest";
import { getRepositoryPath } from "./getRepositoryPath";

describe("getRepositoryPath", () => {
  it("should return the correct repository path", () => {
    const repositoryName = "owner/repo-name";
    const expectedPath = `https://github.com/${repositoryName}`;
    expect(getRepositoryPath(repositoryName)).toBe(expectedPath);
  });
});

import { describe, it, expect } from "vitest";
import { getRepositoryAlias } from "./getRepositoryAlias";

describe("getRepositoryAlias", () => {
  it("should return the correct repository alias", () => {
    const repositoryName = "owner/repo-name";
    const expectedAlias = "repo-name";
    expect(getRepositoryAlias(repositoryName)).toBe(expectedAlias);
  });

  it("should return an empty string if the repository name is invalid", () => {
    const repositoryName = "";
    const expectedAlias = "";
    expect(getRepositoryAlias(repositoryName)).toBe(expectedAlias);
  });

  it("should return the repository name if the repository name does not contain a slash", () => {
    const repositoryName = "repo-name";
    const expectedAlias = "repo-name";
    expect(getRepositoryAlias(repositoryName)).toBe(expectedAlias);
  });
});

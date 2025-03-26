import { describe, expect, it } from "vitest";
import { createIndexContent } from "./createIndexContent";

describe("createIndexContent", () => {
  it("should generate index content correctly", () => {
    const repositoryAlias = "my-repo";
    const filesMetadata = [
      { version: "v1", filepath: "v1.ts" },
      { version: "v2", filepath: "v2.ts" },
    ];
    const expectedContent = `import * as v1 from './v1';
import * as v2 from './v2';
export const myRepo = {
  v1,
  v2
};`;
    expect(createIndexContent(repositoryAlias, filesMetadata)).toBe(
      expectedContent,
    );
  });

  it("should handle empty filesMetadata", () => {
    const repositoryAlias = "my-repo";
    const filesMetadata: { version: string; filepath: string }[] = [];
    const expectedContent = `
export const myRepo = {
  
};`;
    expect(createIndexContent(repositoryAlias, filesMetadata)).toBe(
      expectedContent,
    );
  });
});

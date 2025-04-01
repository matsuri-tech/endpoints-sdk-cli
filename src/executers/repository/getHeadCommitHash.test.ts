import { describe, it, expect } from "vitest";
import { getHeadCommitHash } from "./getHeadCommitHash";

describe("getHeadCommitHash", () => {
  it("should return the head commit hash", () => {
    const result = getHeadCommitHash("./");
    expect(result.length).toBeGreaterThan(0);
  });
});

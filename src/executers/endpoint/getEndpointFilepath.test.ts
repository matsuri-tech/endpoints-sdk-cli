import { expect, test } from "vitest";
import { getEndpointFilepath } from "./getEndpointFilepath";

test("Verify that getEndpointFilepath works correctly", () => {
  expect(getEndpointFilepath("repository-name")).toEqual("repository-name");
  expect(getEndpointFilepath("repository-name", "workspace")).toEqual(
    "repository-name.workspace",
  );
  expect(
    getEndpointFilepath("repository-name", "workspace", "version"),
  ).toEqual("repository-name.workspace.version");
  expect(
    getEndpointFilepath("repository-name", "workspace", "version", true),
  ).toEqual("repository-name.workspace.version.ts");
});

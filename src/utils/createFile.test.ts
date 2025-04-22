import { expect, test } from "vitest";
import { createFile } from "./createFile";
import * as fs from "fs";
import * as path from "path";

test("Verify that createFile works correctly", () => {
  const outputDir = "./test-output/test";
  const filename = "test-file.txt";
  const contents = "This is a test file.";
  const filePath = path.join(outputDir, filename);

  createFile(outputDir, filename, contents);

  expect(fs.existsSync(filePath)).toBe(true);
  expect(fs.readFileSync(filePath, "utf-8")).toBe(contents + "\n");

  fs.unlinkSync(filePath);
  fs.rmdirSync(outputDir);
});

import { expect, test } from "vitest";

import { toCamelCase } from "./toCamelCase";

test("Verify that toCamelCase works correctly", () => {
  expect(toCamelCase("to-camel-case-v3")).toBe("toCamelCaseV3");
  expect(toCamelCase("to_camel_case_v3")).toBe("toCamelCaseV3");
  expect(toCamelCase("ToCamelCaseV3")).toBe("toCamelCaseV3");
  expect(toCamelCase("toCamelCaseV3")).toBe("toCamelCaseV3");
});

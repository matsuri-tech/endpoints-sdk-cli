import { expect, test } from "vitest";
import { parseQueryParams } from "./parseQueryParams";

test("Verify that createQueryParams works correctly", () => {
  const query = "location=ja&age=24&active";
  expect(parseQueryParams(query)).toEqual([
    {
      name: "location",
      example: "ja",
      param_type: "string",
    },
    {
      name: "age",
      example: "24",
      param_type: "number",
    },
    {
      name: "active",
      example: undefined,
      param_type: "string",
    },
  ]);
});

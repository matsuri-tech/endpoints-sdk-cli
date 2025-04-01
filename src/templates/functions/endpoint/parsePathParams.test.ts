import { expect, test } from "vitest";
import { parsePathParams } from "./parsePathParams";

test("Verify that parsePathParams works correctly", () => {
  const path = "/api/v1/users/:id/items/:itemId";
  expect(parsePathParams(path)).toEqual([
    {
      name: "id",
      example: undefined,
      param_type: "string",
    },
    {
      name: "itemId",
      example: undefined,
      param_type: "string",
    },
  ]);
});

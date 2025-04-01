import { expect, test } from "vitest";
import { detectParamType } from "./detectParamType";

test.each([
  ["333", "number"],
  ["123456789", "number"],
  ["123,456,789", "string"],
  ["20220522", "number"],
  ["2022-05-22", "string"],
  ["hello, world", "string"],
])(
  `Verify that detectParamType works correctly with example "%s"`,
  (example, expected) => {
    expect(detectParamType(example)).toBe(expected);
  },
);

import { configs } from "eslint-config-matsuri";

/** @type { import("eslint").Linter.Config[] } */
export default [
  {
    ignores: [".test-output"],
  },
  configs.base,
  configs.javascript,
  configs.typescript,
  configs.test,
];

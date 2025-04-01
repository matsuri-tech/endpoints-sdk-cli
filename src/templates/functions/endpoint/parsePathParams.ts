import { Param } from "./parseQueryParams";

export const parsePathParams = (path: string): Param[] => {
  return path
    .split("/")
    .filter((segment) => segment.startsWith(":"))
    .map((param) => {
      return {
        name: param.slice(1),
        param_type: "string",
      };
    });
};

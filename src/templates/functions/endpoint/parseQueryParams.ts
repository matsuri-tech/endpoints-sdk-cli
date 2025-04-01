import { detectParamType, ParamType } from "./detectParamType";

export interface Param {
  name: string;
  example?: string;
  param_type: ParamType;
}

export const parseQueryParams = (query: string): Param[] => {
  return query.split("&").map((param) => {
    const [name, example] = param.split("=") as [string, string | undefined];
    return {
      name,
      example,
      param_type: example !== undefined ? detectParamType(example) : "string",
    };
  });
};

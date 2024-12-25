export type ParamType = "number" | "string";

export const detectParamType = (example: string): ParamType => {
  if (!isNaN(Number(example))) {
    return "number";
  } else {
    return "string";
  }
};

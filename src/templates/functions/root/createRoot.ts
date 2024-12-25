import { EnvList } from "../../../model/endpoint";

const normalizeName = (name: string) => {
  switch (name) {
    case "dev": {
      return "development";
    }
    case "prod": {
      return "production";
    }
    default: {
      return name;
    }
  }
};

const normalizePath = (path: string) => {
  if (path.endsWith("/")) {
    return path.slice(0, -1);
  } else {
    return path;
  }
};

export const createRoot = (
  environment_identifier: string,
  env: EnvList,
  overrides?: Record<string, string>,
) => {
  const content = Object.entries(env)
    .map(([key, value]) => {
      const name = normalizeName(key);
      const path = normalizePath(overrides?.[key] ?? value);
      return `
    if (${environment_identifier} === "${name}") {       
        __root = "${path}";
    }`;
    })
    .join("\n");

  return `
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    ${content}
    return __root
}`;
};

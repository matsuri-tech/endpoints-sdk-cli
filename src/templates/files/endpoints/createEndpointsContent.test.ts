import { expect, test } from "vitest";
import { createEndpointsContent } from "./createEndpointsContent";

test("Verify that createEndpointsContent works correctly", async () => {
  const repositoryAlias = "test-repo";
  const service = { repository: "test-repo" };
  const period = {
    env: {
      dev: "https://dev.test.com",
    },
    api: {
      testEndpoint: { method: "get", path: "/", desc: "test path" },
      testEndpoint2: { method: "get", path: "/", desc: "test path" },
    },
  };
  const environmentIdentifier = "test";
  const version = "v1";

  const result = await createEndpointsContent(
    repositoryAlias,
    service,
    period,
    environmentIdentifier,
    version,
  );

  expect(result).toBe(`
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    
    if (test === "development") {       
        __root = "https://dev.test.com";
    }
    return __root
}

/**
 * test path
 * 
 */
export const testEndpoint = () => {
    const __root = root();
    const __queries = Object.entries({})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => \`\${key}=\${value}\`)
        .join("&");
    const __path = \`\${__root}/\`;
    return __queries ? \`\${__path}?\${__queries}\` : __path;
};
testEndpoint.method = "get" as const;

/**
 * test path
 * 
 */
export const testEndpoint2 = () => {
    const __root = root();
    const __queries = Object.entries({})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => \`\${key}=\${value}\`)
        .join("&");
    const __path = \`\${__root}/\`;
    return __queries ? \`\${__path}?\${__queries}\` : __path;
};
testEndpoint2.method = "get" as const;
export const testRepo_v1 = {testEndpoint,testEndpoint2};`);
});

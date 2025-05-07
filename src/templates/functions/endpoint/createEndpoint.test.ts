import { expect, test } from "vitest";
import { createEndpoint } from "./createEndpoint";

test("Verify that createEndpoint works correctly", async () => {
  const endpoint = {
    method: "GET",
    path: ":id/:date/?ee&hoge=22&id=hoge",
    desc: "This is health check",
  };
  expect(await createEndpoint("health_check", endpoint)).toEqual(`
/**
 * This is health check
 * @param {string} ee 
 * @param {number} hoge 22
 * @param {string} id hoge
 */
export const health_check = ({ee, hoge, id, date}: {ee?: string, hoge?: number, id?: string, date: string}) => {
    const __root = root();
    const __queries = Object.entries({ee, hoge, id})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => \`\${key}=\${value}\`)
        .join("&");
    const __path = \`\${__root}/\${id}/\${date}/\`;
    return __queries ? \`\${__path}?\${__queries}\` : __path;
};
health_check.method = "GET" as const;`);
});

test("クエリパラメーターが存在しない場合でも正常に生成される", async () => {
  const endpoint = {
    method: "GET",
    path: ":id/:date/",
    desc: "This is health check",
  };
  expect(await createEndpoint("health_check", endpoint)).toEqual(`
/**
 * This is health check
 * 
 */
export const health_check = ({id, date}: {id: string, date: string}) => {
    const __root = root();
    const __queries = Object.entries({})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => \`\${key}=\${value}\`)
        .join("&");
    const __path = \`\${__root}/\${id}/\${date}/\`;
    return __queries ? \`\${__path}?\${__queries}\` : __path;
};
health_check.method = "GET" as const;`);
});

test("パスパラメーターが存在しない場合でも正常に生成される", async () => {
  const endpoint = {
    method: "GET",
    path: "health",
    desc: "This is health check",
  };
  expect(await createEndpoint("health_check", endpoint)).toEqual(`
/**
 * This is health check
 * 
 */
export const health_check = () => {
    const __root = root();
    const __queries = Object.entries({})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => \`\${key}=\${value}\`)
        .join("&");
    const __path = \`\${__root}/health\`;
    return __queries ? \`\${__path}?\${__queries}\` : __path;
};
health_check.method = "GET" as const;`);
});

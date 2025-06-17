import { Endpoint } from "../../../model/endpoint";
import { parsePathParams } from "./parsePathParams";
import { Param, parseQueryParams } from "./parseQueryParams";
import { compile } from "json-schema-to-typescript";

export async function createEndpoint(
  name: string,
  endpoint: Endpoint,
): Promise<string> {
  const pv = endpoint.path.split("?");
  const endpointPath = pv[0].replace(/^\//, "");
  const queryParams = pv.length > 1 ? parseQueryParams(pv[1]) : [];
  const pathParams = parsePathParams(endpointPath);

  const paramNames: string[] = [];
  const queryParamNames: string[] = [];
  const params: Param[] = [];

  for (const param of queryParams) {
    if (!paramNames.includes(param.name)) {
      paramNames.push(param.name);
      queryParamNames.push(param.name);
      params.push(param);
    }
  }

  const pathParamNames: string[] = [];
  for (const param of pathParams) {
    if (!paramNames.includes(param.name)) {
      paramNames.push(param.name);
      pathParamNames.push(param.name);
      params.push(param);
    }
  }

  const description = endpoint.desc;
  const queryParamsComment =
    queryParams.length > 0
      ? queryParams
          .map(
            (param) =>
              `@param {${param.param_type}} ${param.name} ${
                param.example ?? ""
              }`,
          )
          .join("\n * ")
      : "";

  const hasPrameters = paramNames.length > 0;
  const parameters = paramNames.join(", ");
  const parameterTypes = params
    .map(
      (param) =>
        `${param.name}${pathParamNames.includes(param.name) ? "" : "?"}: ${
          param.param_type
        }`,
    )
    .join(", ");

  const queryParamNamesStr = queryParamNames.join(", ");
  const pathTemplate = pathParams.reduce(
    (template, param) =>
      template.replace(`:${param.name}`, `\${${param.name}}`),
    endpointPath,
  );

  const request = endpoint.request
    ? await compile(endpoint.request, `${name}Request`)
    : undefined;
  const response = endpoint.response
    ? await compile(endpoint.response, `${name}Response`)
    : undefined;

  const func = `
/**
 * ${description}
 * ${queryParamsComment}
 */
export const ${name} = (${hasPrameters ? `{${parameters}}: {${parameterTypes}}` : ``}) => {
    const __root = root();
    const __queries = Object.entries({${queryParamNamesStr}})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => \`\${key}=\${value}\`)
        .join("&");
    const __path = \`\${__root}/${pathTemplate}\`;
    return __queries ? \`\${__path}?\${__queries}\` : __path;
};`;

  const method =
    endpoint.method !== undefined
      ? `${name}.method = "${endpoint.method}" as const;`
      : false;
  const authSchema =
    endpoint.authSchema !== undefined
      ? `${name}.authSchema = ${JSON.stringify(endpoint.authSchema)} as const;`
      : false;

  return [request, response, func, method, authSchema]
    .filter(Boolean)
    .join("\n");
}

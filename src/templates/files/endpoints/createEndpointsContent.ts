import { Service } from "../../../model/config";
import { EndpointAssets } from "../../../model/endpoint";
import { toCamelCase } from "../../../utils/toCamelCase";
import { createEndpoint } from "../../functions/endpoint/createEndpoint";
import { createRoot } from "../../functions/root/createRoot";

export const createEndpointsContent = async (
  repositoryAlias: string,
  service: Service,
  period: Required<EndpointAssets>,
  environmentIdentifier: string,
  version: string,
) => {
  const names: string[] = [];
  const functions: string[] = [];

  const root = createRoot(environmentIdentifier, period.env, service.roots);
  functions.push(root);

  for (const [name, endpoint] of Object.entries(period.api)) {
    const camelCaseName = toCamelCase(name);
    names.push(camelCaseName);
    const endpointFunc = await createEndpoint(camelCaseName, endpoint);
    functions.push(endpointFunc);
  }

  const exports = `export const ${toCamelCase(repositoryAlias)}_${toCamelCase(
    version,
  )} = {${names.join(",")}};`;

  return `${functions.join("\n")}
${exports}`;
};

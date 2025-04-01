import { readConfigFile } from "../executers/config";
import { createEndpointFiles } from "../executers/endpoint/createEndpointFiles";

export const install = async () => {
  const config = await readConfigFile();

  for (const [alias, service] of Object.entries(config.dependencies)) {
    await createEndpointFiles(
      alias,
      service,
      config.environment_identifier,
      config.output,
    );
  }
};

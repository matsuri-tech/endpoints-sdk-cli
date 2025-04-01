import { readConfigFile, writeConfigFile } from "../executers/config";
import { createEndpointFiles } from "../executers/endpoint/createEndpointFiles";

export const update = async (alias: string) => {
  const config = await readConfigFile();

  const service = config.dependencies[alias];

  const updated = await createEndpointFiles(
    alias,
    {
      ...service,
      version: undefined,
    },
    config.environment_identifier,
    config.output,
  );

  config.push(alias, updated);

  await writeConfigFile(config);
};

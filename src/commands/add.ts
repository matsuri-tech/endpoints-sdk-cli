import { readConfigFile, writeConfigFile } from "../executers/config";
import { createEndpointFiles } from "../executers/endpoint/createEndpointFiles";
import { getRepositoryPath } from "../executers/repository/getRepositoryPath";
import { getRepositoryAlias } from "../executers/repository/getRepositoryAlias";

export const add = async (
  repositoryName: string,
  workspaces?: string[],
  branch?: string,
  exclduePeriods?: string[],
) => {
  const config = await readConfigFile();
  const alias = getRepositoryAlias(repositoryName);
  const repositoryPath = getRepositoryPath(repositoryName);

  const service = await createEndpointFiles(
    alias,
    {
      version: undefined,
      repository: repositoryPath,
      workspaces,
      branch,
      exclude_periods: exclduePeriods,
    },
    config.environment_identifier,
    config.output,
  );

  config.push(alias, service);

  await writeConfigFile(config);
};

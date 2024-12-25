import {
  getRepositoryData,
  detectMainBranch,
  getHeadCommitHash,
  cloneRepository,
} from "../repository";
import { Service } from "../../model/config";
import { createEndpointsContent } from "../../templates/files/endpoints/createEndpointsContent";
import { getEndpointFilepath } from "./getEndpointFilepath";
import { createFile } from "../../utils/createFile";
import { createIndexContent } from "../../templates/files/index/createIndexContent";
import { EndpointAssets } from "../../model/endpoint";

export async function createEndpointFiles(
  repositoryAlias: string,
  service: Service,
  environmentIdentifier: string,
  output: string,
): Promise<Service> {
  const clonedRepositoryPath = cloneRepository(service.repository);
  const commitHash = service.version ?? getHeadCommitHash(clonedRepositoryPath);
  const branchName = service.branch ?? detectMainBranch(clonedRepositoryPath);
  const workspace = service.workspaces ? service.workspaces[0] : undefined;

  const repositoryData = await getRepositoryData(
    clonedRepositoryPath,
    branchName,
    workspace,
    service.version,
  );

  const filesMetadata = [];

  for (const [version, period] of Object.entries(repositoryData)) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (service.exclude_periods?.includes(version)) {
      continue;
    }

    if (period.env === undefined || period.api === undefined) continue;

    const filepath = getEndpointFilepath(
      repositoryAlias,
      workspace,
      version,
      true,
    );

    filesMetadata.push({
      version,
      filepath,
    });

    const content = await createEndpointsContent(
      repositoryAlias,
      service,
      period as Required<EndpointAssets>,
      environmentIdentifier,
      version,
    );

    createFile(output, filepath, content);
  }

  createFile(
    output,
    getEndpointFilepath(repositoryAlias, undefined, undefined, true),
    createIndexContent(repositoryAlias, filesMetadata),
  );

  return {
    ...service,
    version: commitHash,
    branch: branchName,
    workspaces: workspace !== undefined ? [workspace] : undefined,
  };
}

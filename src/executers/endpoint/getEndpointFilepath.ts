export function getEndpointFilepath(
  repositoryName: string,
  workspace?: string,
  version?: string,
  hasExtension = false,
): string {
  let baseName = repositoryName;

  if (workspace !== undefined) {
    baseName += `.${workspace}`;
  }

  if (version !== undefined) {
    baseName += `.${version}`;
  }

  if (hasExtension) {
    baseName += ".ts";
  }

  return baseName;
}

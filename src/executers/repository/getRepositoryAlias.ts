export function getRepositoryAlias(repositoryName: string): string {
  const alias = repositoryName.split("/").pop();
  return alias ?? "";
}

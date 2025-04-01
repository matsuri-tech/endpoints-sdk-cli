import { execSync } from "child_process";

export function getHeadCommitHash(repositoryPath: string): string {
  const output = execSync("git rev-parse HEAD", { cwd: repositoryPath });
  return output.toString().trim();
}

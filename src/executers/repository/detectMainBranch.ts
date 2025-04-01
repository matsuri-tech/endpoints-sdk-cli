import { execSync } from "child_process";

export function detectMainBranch(repositoryPath: string): string {
  const output = execSync("git rev-parse --abbrev-ref HEAD", {
    cwd: repositoryPath,
  });
  return output.toString().trim();
}

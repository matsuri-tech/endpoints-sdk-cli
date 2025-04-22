import { spawnSync } from "child_process";

export function cloneRepository(sshPath: string, workspace: string | undefined): string {
  console.info(`git clone ${sshPath}...`);
  const cache = `node_modules/.endpoints-tmp/${new Date().getTime()}`;
  const result = spawnSync("git", [
    "clone",
    "--no-checkout",
    "--quiet",
    sshPath,
    cache,
  ]);

  const error = result.stderr.toString();

  if (error) {
    throw new Error(`Failed to clone repository: ${error}`);
  }

  spawnSync("git", ["sparse-checkout", "init", "--cone"], { cwd: cache });

  const endpointsFile = workspace !== null ? `${workspace}/.endpoints.json` : ".endpoints.json";
  spawnSync("git", ["sparse-checkout", "set", endpointsFile], { cwd: cache });

  console.info(`git clone ${sshPath} done!`);
  return cache;
}

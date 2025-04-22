import { spawnSync } from "child_process";
import * as fs from "fs";
import { EndpointSetting } from "../../model/endpoint";
import { parseJsonSchema } from "./parseJsonSchema";

export async function getRepositoryData(
  repositoryPath: string,
  branchName: string,
  workspace?: string,
  commitHash?: string,
): Promise<EndpointSetting> {
  
  const checkoutResult = spawnSync(
    "git",
    ["checkout", branchName],
    { cwd: repositoryPath },
  );

  if (checkoutResult.status !== 0) {
    console.error(checkoutResult.stderr.toString());
    throw new Error("Failed to checkout");
  }

  if (commitHash !== undefined) {
    const resetResult = spawnSync("git", ["reset", "--hard", commitHash], {
      cwd: repositoryPath,
    });
    if (resetResult.status !== 0) {
      console.error(resetResult.stderr.toString());
      throw new Error("Failed to git reset");
    }
  }

  const targetFile =
    workspace !== undefined
      ? `${repositoryPath}/${workspace}/.endpoints.json`
      : `${repositoryPath}/.endpoints.json`;

  const contents = fs.readFileSync(targetFile, "utf-8");
  const setting = JSON.parse(contents) as EndpointSetting;

  return parseJsonSchema<EndpointSetting>(setting);
}

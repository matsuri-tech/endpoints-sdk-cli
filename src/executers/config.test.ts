import { expect, test } from "vitest";
import { createConfigFile, readConfigFile, writeConfigFile } from "./config";

test("Verify that the Config file is read and written correctly", async () => {
  /**
   * Create a new config file
   */
  await createConfigFile();

  /**
   * Read the config file
   */
  const config = await readConfigFile();

  expect(config.json()).toMatchInlineSnapshot(`"{
  "$schema": "https://matsuri-tech.github.io/endpoints-sdk-cli/schema.json",
  "output": "./endpoints/",
  "environment_identifier": "process.env.NODE_ENV",
  "dependencies": {}
}"`);

  config.push("service-name", {
    version: "13e240a5d683121c4d38f212d566d4e85c2633eb",
    repository: "git@github.com:matsuri-tech/endpoints-sdk-cli.git",
  });

  /**
   * Write the config file
   */
  await writeConfigFile(config);

  const updatedConfig = await readConfigFile();

  expect(updatedConfig.json()).toMatchInlineSnapshot(`"{
  "$schema": "https://matsuri-tech.github.io/endpoints-sdk-cli/schema.json",
  "output": "./endpoints/",
  "environment_identifier": "process.env.NODE_ENV",
  "dependencies": {
    "service-name": {
      "version": "13e240a5d683121c4d38f212d566d4e85c2633eb",
      "repository": "git@github.com:matsuri-tech/endpoints-sdk-cli.git"
    }
  }
}"`);
});

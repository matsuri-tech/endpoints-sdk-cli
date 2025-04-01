import { expect, test } from "vitest";
import { Config, Service } from "./config";

test("Verify that the default values in Config are correct", () => {
  const config = new Config();

  expect(config.json()).toMatchInlineSnapshot(`"{
  "$schema": "https://matsuri-tech.github.io/endpoints-sdk-cli/schema.json",
  "output": "./endpoints/",
  "environment_identifier": "process.env.NODE_ENV",
  "dependencies": {}
}"`);
});

test("Verify that the Config is updated correctly when services are pushed", () => {
  const config = new Config();
  const serviceName = "service-name";
  const service: Service = {
    version: "13e240a5d683121c4d38f212d566d4e85c2633eb",
    repository: "git@github.com:matsuri-tech/endpoints-sdk-cli.git",
  };
  config.push(serviceName, service);

  expect(config.json()).toMatchInlineSnapshot(`"{
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

import { Config, ConfigOption } from "../model/config";
import fs from "node:fs/promises";

const CONFIG_FILE_NAME = "endpoints.config.json";

export const writeConfigFile = async (config: Config) => {
  await fs.writeFile(CONFIG_FILE_NAME, config.json());
};

export const createConfigFile = async () => {
  const config = new Config();
  await writeConfigFile(config);
};

export const readConfigFile = async (): Promise<Config> => {
  const content = await fs.readFile(CONFIG_FILE_NAME, "utf-8");
  return new Config(JSON.parse(content) as ConfigOption);
};

export interface Service {
  version?: string;
  repository: string;
  workspaces?: string[];
  branch?: string;
  exclude_periods?: string[];
  roots?: Record<string, string>;
}

export interface ConfigOption {
  output: string;
  environment_identifier: string;
  dependencies: Record<string, Service>;
}

export const createConfigOption = (): ConfigOption => {
  return {
    output: "./endpoints/",
    environment_identifier: "process.env.NODE_ENV",
    dependencies: {},
  };
};

export class Config {
  $schema: string;
  output: string;
  environment_identifier: string;
  dependencies: Record<string, Service>;

  constructor(option: ConfigOption = createConfigOption()) {
    this.$schema =
      "https://matsuri-tech.github.io/endpoints-sdk-cli/schema.json";
    this.output = option.output;
    this.environment_identifier = option.environment_identifier;
    this.dependencies = option.dependencies;
  }

  push(name: string, service: Service) {
    this.dependencies[name] = service;
  }

  json(): string {
    return JSON.stringify(this, null, 2);
  }
}

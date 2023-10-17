import * as fs from 'node:fs'
import * as path from 'node:path'
import * as prettier from 'prettier'
import {unique} from '../utils/unique'

export interface Roots {
  [env: string]: string;
}

interface Dependencies {
  [service: string]: {
    version: string;
    repository: string;
    roots?: Roots;
    workspaces?: string[];
    branch?: string;
    exclude_periods?: string[];
  };
}

interface ConfigData {
  $shema: string;
  dependencies: Dependencies;
  path: string;
  output: string;
  environment_identifier: string;
}

export class Config {
  data: Partial<ConfigData> = {}

  dependencies: Dependencies = {};

  path = 'endpoints.config.json';

  output = fs.existsSync(path.resolve('./src')) ? './src/endpoints/' : './endpoints/';

  environment_identifier = 'process.env.NODE_ENV';

  constructor() {
    if (fs.existsSync(this.path)) {
      const data: ConfigData = JSON.parse(fs.readFileSync(this.path).toString())
      this.data = data
      if (data.dependencies) {
        this.dependencies = data.dependencies
      }

      if (data.output) {
        this.output = data.output
      }

      if (!fs.existsSync(this.output)) {
        fs.mkdirSync(this.output)
      }

      if (data.environment_identifier) {
        this.environment_identifier = data.environment_identifier
      }
    }
  }

  push({name, path, version, workspace, branch, exclude_periods}: {
      name: string;
      path: string;
      version: string;
      workspace?: string;
      branch: string | undefined;
      exclude_periods: string[] | undefined;
    },
  ) {
    const workspaces = unique([
      ...(this.dependencies?.[name]?.workspaces || []),
      workspace,
    ]).filter((w): w is string => Boolean(w))

    this.dependencies = {
      ...this.dependencies,
      [name]: {
        ...this.dependencies?.[name],
        version,
        repository: path,
        branch,
        exclude_periods,
        workspaces: workspaces.length > 0 ? workspaces : undefined,
      },
    }
  }

  publish() {
    const data = {
      ...this.data,
      $schema: 'https://matsuri-tech.github.io/endpoints-sdk-cli/schema.json',
      output: this.output,
      environment_identifier: this.environment_identifier,
      dependencies: this.dependencies,
    }
    fs.writeFileSync(
      this.path,
      prettier.format(JSON.stringify(data, null, 2), {parser: 'json'}),
    )
  }
}

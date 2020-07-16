import {writeFileSync} from 'fs'
import * as prettier from 'prettier'
import {CONFIG_FILE} from '../constants'
export const updateConfigFile = (config: Config, {repository, service, version, workspace}: {
  service: string;
  version: string;
  repository: string;
  workspace?: string;
}) => {
  const configWorkspace = config.dependencies?.[service]?.workspaces
  const data: Config = {
    ...config,
    dependencies: {
      ...config.dependencies,
      [service]: {
        version,
        repository,
        workspaces: workspace ? configWorkspace ? [...new Set([
          ...configWorkspace,
          workspace,
        ])] : [...new Set([workspace])] : undefined,
      },
    },
  }
  return writeFileSync(CONFIG_FILE, prettier.format(JSON.stringify(data, null, 2), {parser: 'json'}))
}

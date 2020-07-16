import {writeFileSync} from 'fs'
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
  return writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2))
}

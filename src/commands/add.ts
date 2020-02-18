import {Command, flags} from '@oclif/command'
import {existsSync, readFileSync} from 'fs'
import {color} from '@oclif/color'
import {makeEndpointsSourceFromRepository} from '../utils/makeEndpointsSourceFromRepository'
import {makeEndpointsFiles} from '../utils/makeEndpointsFiles'
import {inferRepository} from '../utils/inferRepository'
import {extractServiceNameFromPath} from '../utils/extractServiceNameFromPath'
import {CONFIG_FILE} from '../constants'
import {updateConfigFile} from '../utils/updateConfigFile'

export default class Add extends Command {
  static description = `
add service to dependencies & make endpoints files.

1. make endpoints.config.json for version control.

{
  "dependencies": {
    "service-name": {
      "version": "26177ed7e673daf0cc5a69e9793dd863424d272f",
      "repository": "git@github.com:[username/repository].git"
    }
  }
}

> service name is inferred from Repository name.

2. make src/endpoints/[service-name].ts
`

  static args = [{name: 'repository'}]

  static flags = {
    version: flags.string({char: 'v', description: 'latest or commit hash'}),
    workspace: flags.string({char: 'w', description: 'a path to workspace containing .endpoints.json'}),
  }

  static examples = [
    '$ mes add [username/repository]',
    '$ mes add [username/repository] --version [commmit hash]',
    '$ mes add [username/repository] -v [commmit hash]',
    '$ mes add [username/repository] -v latest',
    '$ mes add [username/repository] --workspace [workspace directory]',
    '$ mes add [username/repository] -w [workspace directory]',
    '$ mes add /Users/.../local-repository/',
    '$ mes add ./local-repository',
    '$ mes add git@github.com:[username/repository].git',
    '$ mes add https://github.com/[username/repository].git',
  ]

  async run() {
    const {args: {repository: _repository}, flags: {version, workspace}}: {
      args: {
        repository: string;
      };
      flags: {
        version?: string;
        workspace?: string;
      };
    } = this.parse(Add)

    const repository = inferRepository(_repository)

    const repository_name = extractServiceNameFromPath(repository)
    const {getEndpointsSourceFromRepository, cleanEndpointsSourceFromRepository} = makeEndpointsSourceFromRepository()

    try {
      const {hash, data} = getEndpointsSourceFromRepository({repository, version, workspace})

      const config: Config = existsSync(CONFIG_FILE) ? JSON.parse(readFileSync(CONFIG_FILE).toString()) : {dependencies: {}}

      makeEndpointsFiles({workspace, data, config, repository_name})

      updateConfigFile(config, {
        service: repository_name,
        repository,
        workspace,
        version: version || hash,
      })

      this.log(`${color.green('success')}: ${repository_name} updated!`)
    } catch (error) {
      this.error(color.red(error.message))
    } finally {
      cleanEndpointsSourceFromRepository()
    }
  }
}

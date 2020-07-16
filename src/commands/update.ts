import {Command} from '@oclif/command'
import {color} from '@oclif/color'
import {getConfig} from '../utils/getConfig'
import {makeEndpointsSourceFromRepository} from '../parts/makeEndpointsSourceFromRepository'
import {makeEndpointsFiles} from '../parts/makeEndpointsFiles'
import {updateConfigFile} from '../utils/updateConfigFile'

export default class Update extends Command {
  static description = 'update service version & regenerate endpoints files'

  static args = [{name: 'service'}]

  async run() {
    const {args} = this.parse<{}, {service: string}>(Update)

    const {getEndpointsSourceFromRepository, cleanEndpointsSourceFromRepository} = makeEndpointsSourceFromRepository()

    try {
      const config = getConfig()
      if (!config.dependencies) {
        throw new Error('Dependencies property of the endpoints.config.json does not exist. Use the add command to add dependencies before installing')
      }
      if (!(args.service in config.dependencies)) {
        throw new Error('The service does not exist in the dependency. Check dependencies property of the endpoints.config.json. Or use the add command to add dependencies before installing')
      }
      const {repository, version, workspaces = ['']} = config.dependencies[args.service]
      // eslint-disable-next-line array-callback-return
      workspaces.map(workspace => {
        const {hash, data} = getEndpointsSourceFromRepository({repository, workspace})

        makeEndpointsFiles({data, workspace, repository_name: args.service, config})

        updateConfigFile(config, {
          service: args.service,
          version: version === 'latest' ? 'latest' : hash,
          repository,
          workspace,
        })
      })
    } catch (error) {
      this.error(color.red(error.message))
    } finally {
      cleanEndpointsSourceFromRepository()
    }
  }
}

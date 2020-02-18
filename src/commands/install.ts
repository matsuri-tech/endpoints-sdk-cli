import {Command} from '@oclif/command'
import {color} from '@oclif/color'
import {makeEndpointsSourceFromRepository} from '../utils/makeEndpointsSourceFromRepository'
import {getConfig} from '../utils/getConfig'
import {makeEndpointsFiles} from '../utils/makeEndpointsFiles'

export default class Install extends Command {
  static description = 'generate endpoints files based on endpoints.config.json'

  async run() {
    const {getEndpointsSourceFromRepository, cleanEndpointsSourceFromRepository} = makeEndpointsSourceFromRepository()
    try {
      const config = getConfig()
      if (!config.dependencies) {
        throw new Error('Dependencies property of the endpoints.config.json does not exist. Use the add command to add dependencies before installing')
      }

      // eslint-disable-next-line array-callback-return
      Object.entries(config.dependencies).map(([repository_name, {version, repository, workspaces = ['']}]) => {
        // eslint-disable-next-line array-callback-return
        workspaces.map(workspace => {
          const {data} = getEndpointsSourceFromRepository({repository, version, workspace})
          makeEndpointsFiles({workspace, data, repository_name, config})
        })
      })
    } catch (error) {
      this.error(color.red(error.message))
    } finally {
      cleanEndpointsSourceFromRepository()
    }
  }
}

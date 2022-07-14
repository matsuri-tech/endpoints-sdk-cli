import {Repository} from '../classes/Repository'
import {Config} from '../classes/Config'
import {Command} from '@oclif/command'
import {color} from '@oclif/color'
import {makeFiles} from '../makeFiles'

export default class Update extends Command {
  static description = 'update service version & regenerate endpoints files'

  static args = [{name: 'service'}]

  async run() {
    const {args} = this.parse<{}, {service: string}>(Update)

    const repositories: Repository[] = []

    try {
      const config = new Config()

      if (!config.dependencies) {
        throw new Error('Dependencies property of the endpoints.config.json does not exist. Use the add command to add dependencies before installing')
      }

      if (!(args.service in config.dependencies)) {
        throw new Error('The service does not exist in the dependency. Check dependencies property of the endpoints.config.json. Or use the add command to add dependencies before installing')
      }

      const {repository: path, version, workspaces = ['']} = config.dependencies[args.service]

      for (const workspace of workspaces) {
        const repository = new Repository(path)
        repository.clone({version, workspace})
        makeFiles({repository, config, workspace})
        config.push({
          name: repository.name,
          path: repository.path,
          version: repository.hash,
          workspace,
        })
        repositories.push(repository)
      }

      config.publish()
    } catch (error) {
      // @ts-expect-error
      this.error(color.red(error.message))
    } finally {
      for (const repository of repositories) {
        repository.clean()
      }
    }
  }
}

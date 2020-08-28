import {Config} from '../classes/Config'
import {Command} from '@oclif/command'
import {color} from '@oclif/color'
import {Repository} from '../classes/Repository'
import {makeFiles} from '../makeFiles'

export default class Install extends Command {
  static description = 'generate endpoints files based on endpoints.config.json'

  async run() {
    const repositories: Repository[] = []
    try {
      const config = new Config()
      if (!config.dependencies) {
        throw new Error('Dependencies property of the endpoints.config.json does not exist. Use the add command to add dependencies before installing')
      }

      Object.values(config.dependencies).forEach(({repository: path, version, workspaces = ['']}) => {
        workspaces.forEach(workspace => {
          const repository = new Repository(path)
          repositories.push(repository)
          repository.clone({version, workspace})
          makeFiles({repository, workspace, config})
        })
      })
    } catch (error) {
      this.error(color.red(error.message))
    } finally {
      repositories.forEach(repository => {
        repository.clean()
      })
    }
  }
}

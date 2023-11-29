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

      await Promise.all(Object.entries(config.dependencies).map(async ([_name, {repository: path, version, workspaces = [''], roots, branch, exclude_periods}]) => {
        return Promise.all(workspaces.map(async workspace => {
          const repository = new Repository(path)
          repositories.push(repository)
          await repository.clone({version, workspace, branch})
          await makeFiles({repository, workspace, config, roots, exclude_periods})
        }))
      }))
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

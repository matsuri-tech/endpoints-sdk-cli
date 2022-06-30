import {Config} from '../classes/Config'
import {Command, flags} from '@oclif/command'
import {color} from '@oclif/color'
import {Repository} from '../classes/Repository'
import {makeFiles} from '../makeFiles'

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
`;

  static args = [{name: 'repository'}];

  static flags = {
    version: flags.string({char: 'v', description: 'latest or commit hash'}),
    workspace: flags.string({
      char: 'w',
      description: 'a path to workspace containing .endpoints.json',
    }),
  };

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
  ];

  async run() {
    const {flags: {version, workspace}, args} = this.parse<
      { version?: string; workspace?: string },
      { repository: string }
    >(Add)

    const repository = new Repository(args.repository)

    try {
      repository.clone({version, workspace})

      const config = new Config()

      makeFiles({repository, config, workspace})

      config.push({
        name: repository.name,
        path: repository.path,
        version: version || repository.hash,
        workspace,
      })

      config.publish()

      this.log(`${color.green('success')}: ${repository.name} updated!`)
    } catch (error) {
      // @ts-expect-error
      this.error(color.red(error.stack))
    } finally {
      repository.clean()
    }
  }
}

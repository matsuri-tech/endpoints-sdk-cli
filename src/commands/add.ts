import {Command, flags} from '@oclif/command'
import {writeFileSync, existsSync, mkdirSync} from 'fs'
import {color} from '@oclif/color'
import {camelCase} from '../utils/camelCase'
import {parseEndpoints} from '../utils/parseEndpoints'
import * as prettier from 'prettier'
import * as path from 'path'
import {makeEndpointsSourceFromRepository} from '../utils/makeEndpointsSourceFromRepository'
import {getConfig} from '../utils/getConfig'

const extractServiceNameFromPath = (path: string) => {
  const splits = path.split('/')
  const name = splits[splits.length - 1].split(/\./)[0]
  return name
}

const inferRepository = (str: string) => {
  if (str.startsWith('https://')) {
    return str
  }
  if (str.startsWith('git@')) {
    return str
  }
  if (str.startsWith('./')) {
    return path.resolve(str)
  }
  if (str.startsWith('/')) {
    return str
  }
  return `git@github.com:${str}.git`
}

export default class Add extends Command {
  static description = `
add service to dependencies & make endpoints files.

1. make endpoints.config.json for version control.

\`\`\`json
{
  "dependencies": {
    "service-name": {
      "version": "26177ed7e673daf0cc5a69e9793dd863424d272f",
      "repository": "git@github.com:[username/repository].git"
    }
  }
}
\`\`\`

> service name is inferred from Repository name.

2. make src/endpoints/[service-name].ts
`

  static args = [{name: 'repository'}]

  static flags = {
    version: flags.string({char: 'v', description: 'latest or commit hash'}),
  }

  static examples = [
    '$ mes add [username/repository]',
    '$ mes add [username/repository] --version [commmit hash]',
    '$ mes add [username/repository] -v [commmit hash]',
    '$ mes add [username/repository] -v latest',
    '$ mes add /Users/.../local-repository/',
    '$ mes add ./local-repository',
    '$ mes add git@github.com:[username/repository].git',
    '$ mes add https://github.com/[username/repository].git',
  ]

  async run() {
    const {args: {repository: _repository}, flags}: {
      args: {
        repository: string;
      };
      flags: {
        version?: string;
      };
    } = this.parse(Add)

    const repository = inferRepository(_repository)

    const repository_name = extractServiceNameFromPath(repository)
    const repositoryName = camelCase(repository_name)
    const {getEndpointsSourceFromRepository, cleanEndpointsSourceFromRepository} = makeEndpointsSourceFromRepository()

    try {
      const {hash, data} = getEndpointsSourceFromRepository(repository, flags.version)

      const config = getConfig()

      if (config.dependencies?.[repositoryName] &&
        flags.version === undefined && (
          config.dependencies[repositoryName].version === hash  ||
          config.dependencies[repositoryName].version === 'latest'
        )
      ) {
        this.log(`${repositoryName} is latest version.`)
      } else {
        const outputDir = './src/endpoints/'

        if (!existsSync(outputDir)) {
          mkdirSync(outputDir)
        }

        const files: {
          'version': string;
          'basename': string;
        }[] = []
        // eslint-disable-next-line array-callback-return
        parseEndpoints(data).map(({version, endpoints}) => {
          const main = `export const ${repositoryName}_${camelCase(version)} = {${Object.keys(endpoints).join(',')}}`
          const basename = `${repository_name}.${version}`
          files.push({
            basename,
            version: camelCase(version),
          })
          writeFileSync(`${outputDir}/${basename}.ts`, prettier.format(['/* eslint-disable */', ...Object.values(endpoints), main].join(''), {parser: 'typescript'}))
        })

        writeFileSync(`${outputDir}/${repository_name}.ts`, prettier.format(`/* eslint-disable */ \n ${files.map(({basename, version}) => `import * as ${version} from './${basename}'`).join('\n')}
        export const ${repositoryName} = {${files.map(({version}) => version).join(',')}}`, {parser: 'typescript'}))

        /**
         * Update endpoionts.json
         */
        writeFileSync('endpoints.config.json', JSON.stringify({
          dependencies: {
            ...config.dependencies,
            [repository_name]: {
              version: flags.version || hash,
              repository,
            },
          },
        }, null, 2))

        this.log(`${color.green('success')}: ${repositoryName} updated!`)
      }
    } catch (error) {
      this.error(color.red(error.message))
    } finally {
      cleanEndpointsSourceFromRepository()
    }
  }
}

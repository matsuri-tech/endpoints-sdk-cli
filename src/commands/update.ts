import {Command} from '@oclif/command'
import {writeFileSync, readFileSync, existsSync, mkdirSync} from 'fs'
import {color} from '@oclif/color'
import {camelCase} from '../utils/camelCase'
import {parseEndpoints} from '../utils/parseEndpoints'
import * as prettier from 'prettier'
import {getConfig} from '../utils/getConfig'
import {makeEndpointsSourceFromRepository} from '../utils/makeEndpointsSourceFromRepository'

export default class Update extends Command {
  static description = 'update service version & regenerate endpoints files'

  static args = [{name: 'service'}]

  async run() {
    const {args: {service}}: {
      args: {
        service: string;
      };
    } = this.parse(Update)

    const {getEndpointsSourceFromRepository, cleanEndpointsSourceFromRepository} = makeEndpointsSourceFromRepository()

    try {
      const config = getConfig()
      if (!config.dependencies) {
        throw new Error('Dependencies property of the endpoints.json does not exist. Use the add command to add dependencies before installing')
      }
      if (!(service in config.dependencies)) {
        throw new Error('The service does not exist in the dependency. Check dependencies property of the endpoints.json. Or use the add command to add dependencies before installing')
      }
      const {repository, version} = config.dependencies[service]
      const repository_name = service
      const repositoryName = camelCase(service)
      const {hash, data} = getEndpointsSourceFromRepository(repository)

      const existsFile = existsSync('endpoints.json')
      const endpoints: Config = existsFile ? JSON.parse(readFileSync('endpoints.json').toString()) : {dependencies: {}}

      const outputDir = './src/endpoints'

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
          ...endpoints.dependencies,
          [repository_name]: {
            version: version === 'latest' ? 'latest' : hash,
            repository,
          },
        },
      }, null, 2))

      this.log(`${color.green('success')}: ${repositoryName} updated!`)
    } catch (error) {
      this.error(color.red(error.message))
    } finally {
      cleanEndpointsSourceFromRepository()
    }
  }
}

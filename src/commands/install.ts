import {Command} from '@oclif/command'
import cli from 'cli-ux'
import {writeFileSync, existsSync, mkdirSync} from 'fs'
import {color} from '@oclif/color'
import {parseEndpoints} from '../utils/parseEndpoints'
import {camelCase} from '../utils/camelCase'
import * as prettier from 'prettier'
import {makeEndpointsSourceFromRepository} from '../utils/makeEndpointsSourceFromRepository'
import {getConfig} from '../utils/getConfig'

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
      Object.entries(config.dependencies).map(([repository_name, {version, repository}]) => {
        const {data} = getEndpointsSourceFromRepository(repository, version)

        /**
         * Generate endpoints files
         */
        const files: {
          'version': string;
          'basename': string;
        }[] = []
        cli.action.start(`generating ${repository_name} endpoints files.`)
        const outputDir = './src/endpoints'
        if (!existsSync(outputDir)) {
          mkdirSync(outputDir)
        }
        const repositoryName = camelCase(repository_name)
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
        cli.action.stop()
      })
    } catch (error) {
      this.error(color.red(error.message))
    } finally {
      cleanEndpointsSourceFromRepository()
    }
  }
}

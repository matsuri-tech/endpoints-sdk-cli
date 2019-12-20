import {Command, flags} from '@oclif/command'
import {execSync} from 'child_process'
import {writeFileSync, readFileSync, existsSync, mkdirSync} from 'fs'
import {color} from '@oclif/color'
import {camelCase} from '../utils/camel-case'
import {parseEndpoints} from '../utils/parse-endpoints'
import * as prettier from 'prettier'

interface Endpoints {
  dependencies?: {
    [service: string]: {
      version: string;
      repository: string;
    };
  };
}

export default class Add extends Command {
  static description = 'describe the command here'

  static args = [{name: 'repository'}]

  static flags = {
    version: flags.string({char: 'v', description: 'latest or commit hash'}),
  }

  async run() {
    const {args: {repository}, flags: {version}}: {
      args: {
        repository: string;
      };
      flags: {
        version?: string;
      };
    } = this.parse(Add)

    const splits = repository.split('/')
    const repository_name = splits[splits.length - 1].split(/\./)[0]
    const repositoryName = camelCase(repository_name)

    const tmpDir = '.endpoints-tmp'
    execSync(`git clone --no-checkout ${repository} ${tmpDir}/${repositoryName}`)
    const hash = execSync(`cd ${tmpDir}/${repositoryName}; git rev-parse HEAD`).toString().trim()
    execSync(`cd ${tmpDir}/${repositoryName} && git checkout origin/master -- .endpoints.json`)
    const data = JSON.parse(readFileSync(`${tmpDir}/${repositoryName}/.endpoints.json`).toString())

    execSync('cd ../')
    execSync(`rm -rf ${tmpDir}`)

    const existsFile = existsSync('endpoints.json')
    const endpoints: Endpoints = existsFile ? JSON.parse(readFileSync('endpoints.json').toString()) : {dependencies: {}}

    if (endpoints.dependencies?.[repositoryName] && version === undefined && (endpoints.dependencies[repositoryName].version === hash ||  endpoints.dependencies[repositoryName].version === 'latest')) {
      this.log(`${repositoryName} is latest version.`)
    } else {
      writeFileSync('endpoints.json', JSON.stringify({dependencies: {...endpoints.dependencies, [repositoryName]: {version: version || hash, repository}}}, null, 2))

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

      this.log(`${color.green('success')}: ${repositoryName} updated!`)
    }
  }
}

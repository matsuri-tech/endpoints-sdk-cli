import * as path from 'path'
import * as fs from 'fs'
import {parseEndpoints} from '../utils/parseEndpoints'
import {camelCase} from '../utils/camelCase'
import * as prettier from 'prettier'
import cli from 'cli-ux'

const getWorkspaceName = (dir: string) => {
  return path.basename(dir, path.extname(dir))
}

const DEFAULT_OUTPUT_DIR = fs.existsSync(path.resolve('./src')) ? path.resolve('./src/endpoints/') : path.resolve('./endpoints/')

const resolveFileBasename = (...args: string[]) => {
  return args.filter(e => Boolean(e)).join('.')
}

export const makeEndpointsFiles = ({
  workspace,
  repository_name,
  data,
  config,
}: {
  workspace?: string;
  repository_name: string;
  data: Endpoints;
  config: Config;
}) => {
  const outputDir = config?.output ? path.resolve(config?.output) : DEFAULT_OUTPUT_DIR

  cli.action.start(`generating ${repository_name} endpoints files.`)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }
  const workspaceName = workspace ? getWorkspaceName(workspace) : ''
  const repositoryName = camelCase(repository_name)

  const files: {
      version: string;
      basename: string;
    }[] = []

  parseEndpoints(data, config?.environment_identifier).map(
    // eslint-disable-next-line array-callback-return
    ({version, endpoints}) => {
      const main = `export const ${repositoryName}_${camelCase(
        version,
      )} = {${Object.keys(endpoints).join(',')}}`
      const basename = resolveFileBasename(repository_name, workspaceName, version)
      files.push({
        basename,
        version: camelCase(version),
      })
      fs.writeFileSync(path.resolve(outputDir, `${basename}.ts`),
        prettier.format(
          ['/* eslint-disable */', ...Object.values(endpoints), main].join(''),
          {parser: 'typescript'},
        ),
      )
    },
  )

  fs.writeFileSync(
    path.resolve(outputDir, `${resolveFileBasename(repository_name, workspaceName)}.ts`),
    prettier.format(
      `/* eslint-disable */ \n ${files.map(({basename, version}) => `import * as ${version} from './${basename}'`).join('\n')}
        export const ${repositoryName} = {${files.map(({version}) => version).join(',')}}`,
      {parser: 'typescript'},
    ),
  )

  cli.action.stop()
}

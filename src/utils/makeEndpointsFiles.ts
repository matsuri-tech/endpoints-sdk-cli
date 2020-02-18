import * as path from 'path'
import * as fs from 'fs'
import {parseEndpoints} from './parseEndpoints'
import {camelCase} from './camelCase'
import * as prettier from 'prettier'
import cli from 'cli-ux'

const getWorkspaceName = (dir: string) => {
  return path.basename(dir, path.extname(dir))
}

const DIST_DIRECTORY = './src/endpoints/'

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
  cli.action.start(`generating ${repository_name} endpoints files.`)

  if (!fs.existsSync(DIST_DIRECTORY)) {
    fs.mkdirSync(DIST_DIRECTORY)
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
      fs.writeFileSync(
        `${DIST_DIRECTORY}/${basename}.ts`,
        prettier.format(
          ['/* eslint-disable */', ...Object.values(endpoints), main].join(''),
          {parser: 'typescript'},
        ),
      )
    },
  )

  fs.writeFileSync(
    `${DIST_DIRECTORY}/${resolveFileBasename(repository_name, workspaceName)}.ts`,
    prettier.format(
      `/* eslint-disable */ \n ${files.map(({basename, version}) => `import * as ${version} from './${basename}'`).join('\n')}
      export const ${repositoryName} = {${files.map(({version}) => version).join(',')}}`,
      {parser: 'typescript'},
    ),
  )
  cli.action.stop()
}

import * as path from 'path'
import type {Config} from './classes/Config'
import type {Repository} from './classes/Repository'
import * as templates from './templates'
import * as fs from 'fs'
import {format} from './utils/format'

const makeName = (...args: (string|undefined)[]) => {
  return args.filter(e => Boolean(e)).join('.')
}

export const makeFiles: (args: {
  repository: Repository;
  workspace?: string;
  config: Config;
}) => void = ({repository, workspace, config}) => {
  const files: {
    basename: string;
    version: string;
  }[] = []

  Object.entries(repository.data).forEach(([version, period]) => {
    const content = templates.files.endpoints({repository, version, period, config})
    const basename = makeName(repository.name, workspace, version)

    files.push({version, basename})

    fs.writeFileSync(path.resolve(config.output, `${basename}.ts`), format(content))
  })

  fs.writeFileSync(
    path.resolve(config.output, `${makeName(repository.name, workspace)}.ts`),
    format(templates.files.index({files, repository})),
  )
}

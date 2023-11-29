import * as path from 'node:path'
import type {Config, Roots} from './classes/Config'
import type {Repository} from './classes/Repository'
import * as templates from './templates'
import * as fs from 'node:fs'
import {format} from './utils/format'

const makeName = (...args: (string|undefined)[]) => {
  return args.filter(e => Boolean(e)).join('.')
}

export const makeFiles = async ({repository, workspace, config, roots, exclude_periods}: {
  repository: Repository;
  workspace?: string;
  config: Config;
  roots?: Roots;
  exclude_periods?: string[];
}) => {
  const files: {
    basename: string;
    version: string;
  }[] = []

  await Promise.all(Object.entries(repository.data).map(async ([version, period]) => {
    if (exclude_periods?.includes(version)) {
      return
    }

    const content = await templates.files.endpoints({repository, version, period, config, roots})
    const basename = makeName(repository.name, workspace, version)

    files.push({version, basename})

    fs.writeFileSync(path.resolve(config.output, `${basename}.ts`), format(content))
  }))

  fs.writeFileSync(
    path.resolve(config.output, `${makeName(repository.name, workspace)}.ts`),
    format(templates.files.index({files, repository})),
  )
}

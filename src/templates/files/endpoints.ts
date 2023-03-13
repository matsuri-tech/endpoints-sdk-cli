import type {Config,  Roots} from '../../classes/Config'
import type {Repository, Period} from '../../classes/Repository'
import * as templates from '../functions'
import {camelCase} from '../../utils/camelCase'

export const endpoints = ({
  repository,
  version,
  period,
  config,
  roots,
}: {
    repository: Repository;
    version: string;
    period: Period;
    config: Config;
    roots?: Roots;
  }): string => {
  const names: string[] = []
  const fns = Object.entries(period.api).map(([_name, endpoint]) => {
    const name = camelCase(_name)
    names.push(name)
    return templates.endpoint(name, endpoint)
  })
  const exportFns = `export const ${camelCase(repository.name)}_${camelCase(
    version,
  )} = {${names.join(',')}}`

  const env = {
    ...period.env,
    ...roots,
  }
  return [
    '/* eslint-disable */',
    templates.root({env, config}),
    ...fns,
    exportFns,
  ].join('')
}

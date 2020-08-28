import type {Repository} from '../../classes/Repository'
import {camelCase} from '../../utils/camelCase'

export const indexFile = ({
  files,
  repository,
}: {
  repository: Repository;
  files: {
    basename: string;
    version: string;
  }[];
}) => {
  return `
    /* eslint-disable */
    ${files
  .map(({version, basename}) => {
    return `import * as ${camelCase(version)} from './${basename}'`
  })
  .join('\n')}
  export const ${camelCase(repository.name)} = {${files
.map(({version}) => camelCase(version))
.join(',')}}`
}

import type {Endpoint} from '../../classes/Repository'
import {unique} from '../../utils/unique'

interface Param {
  name: string;
  example?: string;
  type: 'string' | 'number';
}
const isNumberLiteral = (str?: string) => {
  return str && isFinite(Number(str))
}

const detectType = (str?: string) => {
  return isNumberLiteral(str) ? 'number' : 'string'
}

const makeQueryParams = (s?: string): Param[] => {
  return s ? s.split('&').map(f => {
    const [name, example] = f.split('=')
    const type = detectType(example)
    return {
      name,
      example,
      type,
    }
  }) : []
}

const makePathParams = (s: string): Param[] => {
  return s.split('/').map(f => {
    return f.startsWith(':') ? {
      name: f.slice(1),
      type: 'string',
    } : undefined
  }).filter((p): p is Param => Boolean(p))
}

const pickNames = (ps: Param[]) => {
  return ps.map(p => p.name)
}

const makeQueryParamsComments = (qs: Param[]): string => {
  return qs.length > 0 ?
    qs
    .map(q => {
      return `* @param {${q.type}} ${q.name} ${q.example}`
    })
    .join('\n') :
    '*'
}

const makeArguments = (params: Param[], paramNames: string[], pathParamNames: string[]): string => {
  if (paramNames.length === 0) return ''
  return `{${paramNames.join(',')}} : {${params
  .map(p => {
    const op = pathParamNames.includes(p.name) ? '' : '?'
    return `${p.name}${op}:${p.type};`
  })
  .join('')}}`
}

const makePathTemplate = (p: string) => {
  const t = p
  .split('/')
  .map(f => (f.startsWith(':') ? `\${${f.slice(1)}}` : f))
  .join('/')
  return t.startsWith('/') ? t.slice(1) : t
}

export const endpoint = (name: string, e: Endpoint) => {
  const [path, queryParamsStr] = e.path.split('?')

  const queryParams = makeQueryParams(queryParamsStr)
  const pathParams = makePathParams(path)

  const queryParamNames = pickNames(queryParams)
  const pathParamNames = pickNames(pathParams)
  const paramNames = unique([...queryParamNames, ...pathParamNames])

  const params = unique([...queryParams, ...pathParams])

  const QUERY_PARAMS_COMMENTS = makeQueryParamsComments(queryParams)
  const QUERY_PARAMS_OBJECT = `{${queryParamNames.join(',')}}`
  const ARGUMENTS = makeArguments(params, paramNames, pathParamNames)

  const PATH_TEMPLATE = makePathTemplate(path)

  return `
    /**
     * ${e.desc}
     ${QUERY_PARAMS_COMMENTS}
     */
    export const ${name}=(${ARGUMENTS})=>{
      const __root = root();
      const __queries = Object.entries(${QUERY_PARAMS_OBJECT})
        .filter(([_, value])=> {
          return value !== undefined
        })
        .map(([key, value])=> {
          return \`\${key}=\${value}\`
        }).join("&");
      const __path = \`\${__root}/\${\`${PATH_TEMPLATE}\`}\`;
      return __queries ? \`\${__path}?\${__queries}\` : __path;
    }
  `
}

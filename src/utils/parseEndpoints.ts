import {camelCase} from './camelCase'
import {parseUrl} from './parseUrl'

interface Service {
  [prefixName: string]: {
    env: {
      local: string;
      dev: string;
      prod: string;
      [envName: string]: string;
    };
    api: {
      [endpointName: string]: {
        path: string;
        desc?: string;
      };
    };
  };
}

const isNumberLiteral = (str: string) => {
  return str !== '' && isFinite(Number(str))
}
export const parseEndpoints = (
  service: Service,
  environment_identifier = 'process.env.NODE_ENV',
) => {
  return Object.entries(service).map(([version, {env, api}]) => {
    const root = `
    /**
     * A function that returns the URL part common to the endpoints.
     */
    export const root = ()=>{let __root = "";${Object.entries(env)
  .map(
    ([envName, url]) =>
      `if(${environment_identifier}==='${
        envName === 'dev' ?
          'development' :
          envName === 'prod' ?
            'production' :
            envName
      }'){__root = '${url.endsWith('/') ? url.slice(0, -1) : url}'}`,
  )
  .join('')}return __root}`
    let endpoints: {
      [endpoint: string]: string;
    } = {root}

    // eslint-disable-next-line array-callback-return
    Object.entries(api).map(([_endpointName, {path: _path, desc}]) => {
      const endpointName = camelCase(_endpointName)
      if (endpointName === 'root') return null
      const {
        path,
        queryParams,
        paramNames,
        queryParamNames,
        pathParamNames,
        params,
      } = parseUrl(_path)
      const QUERY_PARAMS_COMMENTS = queryParams
      .map(({name, example}) => {
        return `* @param {${
          isNumberLiteral(example) ? 'number' : 'string'
        }} ${name} ${example}`
      })
      .join('\n')
      const QUERY_PARAMS_OBJECT = `{${queryParamNames.join(',')}}`
      const ARGUMENTS =
        paramNames.length === 0 ? '' : `{${paramNames.join(',')}}`
      const ARGUMENTS_TYPE =
        params.length === 0 ?
          '' :
          `{${params
          .map(({name, example}) => {
            const type =
                  example !== undefined && isNumberLiteral(example) ?
                    'number' :
                    'string'
            return pathParamNames.includes(name) ?
              `${name}:${type};` :
              `${name}?:${type};`
          })
          .join('')}}`
      const FIXED_PATH = path
      .split('/')
      .map(pathFrag =>
        pathFrag.startsWith(':') ? `\${${pathFrag.slice(1)}}` : pathFrag,
      )
      .join('/')
      const NORMALIZED_FIXED_PATH =  FIXED_PATH.startsWith('/') ? FIXED_PATH.slice(1) : FIXED_PATH
      const endpoint = `
      /**
       * ${desc}
       * @version ${version}
       ${QUERY_PARAMS_COMMENTS || '*'}
       */
      export const ${endpointName}=(${ARGUMENTS &&
        `${ARGUMENTS}:${ARGUMENTS_TYPE}`})=>{
        const __root = root();
        const __queries = Object.entries(${QUERY_PARAMS_OBJECT}).filter(([_, value])=> value !== undefined).map(([key, value])=> \`\${key}=\${value}\`).join("&");
        const __path = \`\${__root}/\${\`${NORMALIZED_FIXED_PATH}\`}\`;
        return __queries ? \`\${__path}?\${__queries}\` : __path;
      }
      `
      endpoints = {...endpoints, [endpointName]: endpoint}
    })

    return {
      version,
      endpoints,
    }
  })
}

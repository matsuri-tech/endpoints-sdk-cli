import {camelCase} from './camel-case'
import {parseUrl} from './parse-url'

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
                /**
                 * /hello
                 * /hello/
                 * /hello/:hoge
                 * /hello/:hoge/
                 * /hello/:hoge/foo/:bar
                 *
                 * /hello/:name/?name&page&active
                 *
                 * @param {string} name
                 * @param {string?} name ex.) john
                 * @param {number?} page ex.) 4
                 * @param {string?} active ex.) true
                 */
                path: string;
                desc?: string;
            };
        };
    };
}

const isNumberLiteral = (str: string) => {
  return /^([1-9]\d*|0)$/.test(str)
}
export const parseEndpoints = (service: Service) => {
  return Object.entries(service).map(([version, {env, api}]) => {
    const root = `
    /**
     * A function that returns the URL part common to the endpoints.
     */
    export const root = ()=>{let r = "";${Object.entries(env).map(([envName, url]) => `if(process.env.NODE_ENV==='${envName === 'dev' ? 'development' : envName === 'prod' ? 'production' : envName}'){r = '${url}'}`).join('')}return r}`
    let endpoints: {
      [endpoint: string]: string;
    } = {root}

    // eslint-disable-next-line array-callback-return
    Object.entries(api).map(([_endpointName, {path: _path, desc}]) => {
      const endpointName = camelCase(_endpointName)
      if (endpointName === 'root') return null
      const {path, queryParams, paramNames, queryParamNames, pathParamNames} = parseUrl(_path)
      const QUERY_PARAMS_COMMENTS = queryParams.map(({name, example}) => {
        return `* @param {${isNumberLiteral(example) ? 'number' : 'string'}} ${name} ${example}`
      }).join('\n')
      const QUERY_PARAMS_OBJECT = `{${queryParamNames.join(',')}}`
      const ARGUMENTS = paramNames.length === 0 ? '' : `{${paramNames.join(',')}}`
      const ARGUMENTS_TYPE = paramNames.length === 0 ? '' : `{${paramNames.map(paramName => pathParamNames.includes(paramName) ? `${paramName}:string;` : `${paramName}?:string;`).join('')}}`
      const FIXED_PATH = path
      .split('/')
      .map(pathFrag => (pathFrag.startsWith(':') ? `\${${pathFrag.slice(1)}}` : pathFrag))
      .join('/')
      const endpoint = `
      /**
       * ${desc}
       * @version ${version}
       ${QUERY_PARAMS_COMMENTS || '*'}
       */
      export const ${endpointName}=(${ARGUMENTS && `${ARGUMENTS}:${ARGUMENTS_TYPE}`})=>{
        const __root = root();
        const __queries = Object.entries(${QUERY_PARAMS_OBJECT}).filter(([_, value])=> !!value).map(([key, value])=> \`\${key}=\${value}\`).join("&");
        const __path = \`\${__root}/\${\`${FIXED_PATH}\`}\`;
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

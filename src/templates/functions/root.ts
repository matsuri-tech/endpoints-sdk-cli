import type {Config} from '../../classes/Config'
import type {Period} from '../../classes/Repository'

const normalizeName = (n: string) => {
  return n === 'dev' ?
    'development' :
    n === 'prod' ?
      'production' : n
}

const normalizeUrl = (u: string) => {
  return u.endsWith('/') ? u.slice(0, -1) : u
}

export const root: (args: {
  period: Period;
  config: Config;
}) => void = ({period, config}) => {
  const content = Object.entries(period.env).map(([n, u]) => {
    return `
      if(${config.environment_identifier}==="${normalizeName(n)}"){
        __root = '${normalizeUrl(u)}'
      }
    `
  }).join('')

  return `
  /**
   * A function that returns the URL part common to the endpoints.
   */
  export const root = () => {
    let __root = "";
    ${content}
    return __root
  }`
}

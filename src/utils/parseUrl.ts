export const parseUrl = (url: string) => {
  const [path, queryParamsStr] = url.split('?')
  const queryParams = queryParamsStr ? queryParamsStr.split('&').map(frags => {
    const [name, example] = frags.split('=')
    return {
      name,
      example,
    }
  }) : []
  const pathParams = path.split('/').map(pathFrag => {
    if (pathFrag.startsWith(':')) {
      return {
        name: pathFrag.slice(1),
      }
    }
    return undefined
  }).filter((query): query is {
        name: string;
    } => {
    return Boolean(query)
  })

  const queryParamNames =  queryParams.map(queryParam => queryParam.name)
  const pathParamNames = pathParams.map(pathParam => pathParam.name)
  const paramNames =  [...new Set([...queryParamNames, ...pathParamNames])]

  const flags: {
    [name: string]: boolean;
  } = {}

  const params: {
    name: string;
    example?: string;
  }[] = [...queryParams, ...pathParams].filter(entry => {
    if (flags[entry.name]) {
      return false
    }
    flags[entry.name] = true
    return true
  })

  return {
    path,
    queryParams,
    queryParamNames,
    pathParams,
    pathParamNames,
    params,
    paramNames,
  }
}

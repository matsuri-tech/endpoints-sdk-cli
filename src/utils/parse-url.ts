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
  const params = [...queryParams, ...pathParams]
  return {
    path,
    queryParams,
    queryParamNames: queryParams.map(queryParam => queryParam.name),
    pathParams,
    pathParamNames: pathParams.map(pathParam => pathParam.name),
    params,
    paramNames: params.map(param => param.name),
  }
}

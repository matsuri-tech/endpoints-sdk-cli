export const camelCase = (str: string) => {
  const tmp = str.charAt(0).toLowerCase() + str.slice(1)
  return tmp.replace(/[-_.](.)/g, (_, group1: string) => {
    return group1.toUpperCase()
  })
}

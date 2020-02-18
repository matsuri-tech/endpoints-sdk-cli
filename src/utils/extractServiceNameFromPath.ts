export const extractServiceNameFromPath = (path: string) => {
  const splits = path.split('/')
  const name = splits[splits.length - 1].split(/\./)[0]
  return name
}

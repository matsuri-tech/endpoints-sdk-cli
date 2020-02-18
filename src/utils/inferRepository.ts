import * as path from 'path'
export const inferRepository = (str: string) => {
  if (str.startsWith('https://')) {
    return str
  }
  if (str.startsWith('git@')) {
    return str
  }
  if (str.startsWith('./')) {
    return path.resolve(str)
  }
  if (str.startsWith('/')) {
    return str
  }
  return `git@github.com:${str}.git`
}

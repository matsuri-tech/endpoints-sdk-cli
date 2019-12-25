import {existsSync, readFileSync} from 'fs'
export const getConfig = () => {
  const path = 'endpoints.config.json'
  if (!existsSync(path)) {
    throw new Error('The endpoints.json is not found. Use the add command to add dependencies before installing')
  }
  const config: Config = JSON.parse(readFileSync(path).toString())
  return config
}

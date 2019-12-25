import {execSync} from 'child_process'
import {readFileSync} from 'fs'
import cli from 'cli-ux'

export const makeEndpointsSourceFromRepository = (cacheDirectory = './node_modules/.endpoints-tmp/') => {
  const getEndpointsSourceFromRepository = (repository: string, version?: string | 'latest') => {
    const id = Math.random().toString(36).slice(-8)
    const tmp = `${cacheDirectory}${id}`
    cli.action.start(`cloning ${repository}`)
    execSync(`git clone --no-checkout --quiet ${repository} ${tmp}`)
    if (version && version !== 'latest') {
      execSync(`cd ${tmp}; git reset --hard ${version}`)
    }
    const hash = execSync(`cd ${tmp}; git rev-parse HEAD`).toString().trim()
    execSync(`cd ${tmp} && git checkout origin/master -- .endpoints.config.json`)
    const data: Endpoints = JSON.parse(readFileSync(`${tmp}/.endpoints.config.json`).toString())
    cli.action.stop()
    return {
      hash, data,
    }
  }
  const cleanEndpointsSourceFromRepository = () => {
    cli.action.start('cleaning temporary directory')
    execSync(`rm -rf ${cacheDirectory}`)
    cli.action.stop()
  }
  return {
    getEndpointsSourceFromRepository,
    cleanEndpointsSourceFromRepository,
  }
}

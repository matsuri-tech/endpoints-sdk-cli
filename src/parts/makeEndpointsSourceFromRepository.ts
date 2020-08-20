import {execSync} from 'child_process'
import {readFileSync} from 'fs'
import rimraf from 'rimraf'
import cli from 'cli-ux'
import path from 'path'

export const makeEndpointsSourceFromRepository = (cacheDirectory = './node_modules/.endpoints-tmp/') => {
  const getEndpointsSourceFromRepository = ({repository, version, workspace = ''}: {repository: string; version?: string | 'latest'; workspace?: string}) => {
    const id = Math.random().toString(36).slice(-8)
    const tmp = `${cacheDirectory}${id}`
    cli.action.start(`cloning ${repository}`)
    execSync(`git clone --no-checkout --quiet ${repository} ${tmp}`)
    if (version && version !== 'latest') {
      execSync(`cd ${tmp}; git reset --hard ${version}`)
    }
    const hash = execSync(`cd ${tmp}; git rev-parse HEAD`).toString().trim()
    const file = path.resolve(tmp, workspace, '.endpoints.json')
    execSync(`cd ${tmp} && git checkout origin/master -- ${file}`)
    const data: Endpoints = JSON.parse(readFileSync(file).toString())
    cli.action.stop()
    return {
      hash, data,
    }
  }
  const cleanEndpointsSourceFromRepository = () => {
    cli.action.start('cleaning temporary directory')
    rimraf.sync(cacheDirectory)
    cli.action.stop()
  }
  return {
    getEndpointsSourceFromRepository,
    cleanEndpointsSourceFromRepository,
  }
}
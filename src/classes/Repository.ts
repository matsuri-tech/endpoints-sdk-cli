import * as path from 'path'
import {execSync} from 'child_process'
import * as fs from 'fs'
import rimraf from 'rimraf'

export interface Env {
  local: string;
  dev: string;
  prod: string;
  [key: string]: string;
}

export interface Endpoint{
    path: string;
    desc: string;
}

export interface Api{
  [endpoint: string]: Endpoint;
}

export interface Period{
  env: Env;
  api: Api;
}

export interface Data{
  [version: string]: Period;
}

export class Repository {
  name: string;

  path: string;

  cache: string;

  hash = 'latest';

  data: Data = {};

  constructor(str: string) {
    this.path = this.inferPath(str)
    this.name = this.getName()
    this.cache = path.resolve(
      `./node_modules/.endpoints-tmp/${Math.random().toString(36).slice(-8)}`,
    )
  }

  clone({version, workspace = ''}: { version?: string; workspace?: string }) {
    execSync(`git clone --no-checkout --quiet ${this.path} ${this.cache}`)
    this.reset(version)
    this.hash = this.revParse()
    this.data = this.checkout(workspace)
  }

  private checkout(workspace: string) {
    const file = path.resolve(this.cache, workspace, '.endpoints.json')
    execSync(`cd ${this.cache} && git checkout origin/master -- ${file}`)
    return JSON.parse(fs.readFileSync(file).toString())
  }

  private revParse() {
    const hash = execSync(`cd ${this.cache}; git rev-parse HEAD`)
    .toString()
    .trim()
    return hash
  }

  private reset(version?: string) {
    if (version && version !== 'latest') {
      execSync(`cd ${this.cache}; git reset --hard ${version}`)
    }
  }

  clean() {
    rimraf.sync(this.cache)
  }

  private inferPath(str: string) {
    if (
      str.startsWith('https://') ||
      str.startsWith('git@') ||
      str.startsWith('/')
    ) {
      return str
    }
    if (str.startsWith('./')) {
      return path.resolve(str)
    }
    return `git@github.com:${str}.git`
  }

  private getName() {
    const splits = this.path.split('/')
    const name = splits[splits.length - 1].split(/\./)[0]
    return name
  }
}

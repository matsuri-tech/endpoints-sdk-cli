import * as path from 'node:path'
import {execSync} from 'node:child_process'
import * as fs from 'node:fs'
import rimraf from 'rimraf'

export interface Env {
  local: string;
  dev: string;
  prod: string;
  [key: string]: string;
}

export type AuthSchema =
  | {
      type: 'Bearer' | 'Basic';
      header: 'Authorization';
    }
  | {
      type: 'ApiKey';
      header: 'X-Access-Token';
    };

export interface Endpoint {
  path: string;
  desc: string;
  method?: string;
  authSchema?: AuthSchema;
}

export interface Api {
  [endpoint: string]: Endpoint;
}

export interface Period {
  env: Env;
  api: Api;
}

export interface Data {
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

  clone({version, workspace = '', branch}: { version?: string; workspace?: string ; branch: string | undefined }) {
    execSync(`git clone --no-checkout --quiet ${this.path} ${this.cache}`)
    this.reset(version)
    this.hash = this.revParse()
    this.data = this.checkout(workspace, branch)
  }

  private checkout(workspace: string, branch: string | undefined) {
    const file = path.resolve(this.cache, workspace, '.endpoints.json')


    const targetBranch = branch ?? execSync(
      `cd ${this.cache}; git rev-parse --abbrev-ref origin/HEAD`,
    )
    .toString()
    .trim()
    execSync(`cd ${this.cache}; git checkout ${targetBranch} -- ${file}`)
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

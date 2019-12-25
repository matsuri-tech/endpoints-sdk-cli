endpoints-sdk-cli
=======================

Endpoints SDK for JavaScript

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@oclif/example-multi-ts.svg)](https://npmjs.org/package/@oclif/example-multi-ts)
[![CircleCI](https://circleci.com/gh/oclif/example-multi-ts/tree/master.svg?style=shield)](https://circleci.com/gh/oclif/example-multi-ts/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/oclif/example-multi-ts?branch=master&svg=true)](https://ci.appveyor.com/project/oclif/example-multi-ts/branch/master)
[![Codecov](https://codecov.io/gh/oclif/example-multi-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/oclif/example-multi-ts)
[![Downloads/week](https://img.shields.io/npm/dw/@oclif/example-multi-ts.svg)](https://npmjs.org/package/@oclif/example-multi-ts)
[![License](https://img.shields.io/npm/l/@oclif/example-multi-ts.svg)](https://github.com/oclif/example-multi-ts/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g endpoints-sdk-cli
$ mes COMMAND
running command...
$ mes (-v|--version|version)
endpoints-sdk-cli/0.0.11 darwin-x64 node-v12.6.0
$ mes --help [COMMAND]
USAGE
  $ mes COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mes add [REPOSITORY]`](#mes-add-repository)
* [`mes help [COMMAND]`](#mes-help-command)
* [`mes install`](#mes-install)
* [`mes update [SERVICE]`](#mes-update-service)

## `mes add [REPOSITORY]`

add service to dependencies & make endpoints files.

```
USAGE
  $ mes add [REPOSITORY]

OPTIONS
  -v, --version=version  latest or commit hash

DESCRIPTION
  add service to dependencies & make endpoints files.

  1. make endpoints.config.json for version control.

  ```json
  {
     "dependencies": {
       "service-name": {
         "version": "26177ed7e673daf0cc5a69e9793dd863424d272f",
         "repository": "git@github.com:[username/repository].git"
       }
     }
  }
  ```

  > service name is inferred from Repository name.

  2. make src/endpoints/[service-name].ts

EXAMPLES
  $ mes add [username/repository]
  $ mes add [username/repository] --version [commmit hash]
  $ mes add [username/repository] -v [commmit hash]
  $ mes add [username/repository] -v latest
  $ mes add /Users/.../local-repository/
  $ mes add ./local-repository
  $ mes add git@github.com:[username/repository].git
  $ mes add https://github.com/[username/repository].git
```

_See code: [src/commands/add.ts](https://github.com/matsuri-tech/endpoints-sdk-cli/blob/v0.0.11/src/commands/add.ts)_

## `mes help [COMMAND]`

display help for mes

```
USAGE
  $ mes help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `mes install`

generate endpoints files based on endpoints.config.json

```
USAGE
  $ mes install
```

_See code: [src/commands/install.ts](https://github.com/matsuri-tech/endpoints-sdk-cli/blob/v0.0.11/src/commands/install.ts)_

## `mes update [SERVICE]`

update service version & regenerate endpoints files

```
USAGE
  $ mes update [SERVICE]
```

_See code: [src/commands/update.ts](https://github.com/matsuri-tech/endpoints-sdk-cli/blob/v0.0.11/src/commands/update.ts)_
<!-- commandsstop -->

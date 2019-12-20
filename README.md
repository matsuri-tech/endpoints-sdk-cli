endpoints-sdk-cli
=======================

example multi-command CLI built with typescript

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
endpoints-sdk-cli/0.0.2 darwin-x64 node-v12.6.0
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

## `mes add [REPOSITORY]`

describe the command here

```
USAGE
  $ mes add [REPOSITORY]

OPTIONS
  -v, --version=version  latest or commit hash
```

_See code: [src/commands/add.ts](https://github.com/matsuri-tech/endpoints-sdk-cli/blob/v0.0.2/src/commands/add.ts)_

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
<!-- commandsstop -->

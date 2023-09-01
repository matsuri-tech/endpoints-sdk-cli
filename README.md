matsuri-tech/endpoints-sdk-cli (mes)
=======================

Endpoints SDK for JavaScript

※ Include the generated endpoint files in commits.

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Support of `create-react-app`](#support-of-create-react-app)
* [Override root url](#override-root-url)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g endpoints-sdk-cli
$ mes COMMAND
running command...
$ mes (-v|--version|version)
endpoints-sdk-cli/2.6.0 darwin-x64 node-v18.17.1
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
  -b, --branch=branch        branch name to clone
  -v, --version=version      latest or commit hash
  -w, --workspace=workspace  a path to workspace containing .endpoints.json

DESCRIPTION
  add service to dependencies & make endpoints files.

  1. make endpoints.config.json for version control.

  {
    "dependencies": {
      "service-name": {
        "version": "26177ed7e673daf0cc5a69e9793dd863424d272f",
        "repository": "git@github.com:[username/repository].git"
      }
    }
  }

  > service name is inferred from Repository name.

  2. make src/endpoints/[service-name].ts

EXAMPLES
  $ mes add [username/repository]
  $ mes add [username/repository] --version [commmit hash]
  $ mes add [username/repository] -v [commmit hash]
  $ mes add [username/repository] -v latest
  $ mes add [username/repository] --workspace [workspace directory]
  $ mes add [username/repository] -w [workspace directory]
  $ mes add [username/repository] --branch [branch name]
  $ mes add [username/repository] -b [branch name]
  $ mes add /Users/.../local-repository/
  $ mes add ./local-repository
  $ mes add git@github.com:[username/repository].git
  $ mes add https://github.com/[username/repository].git
```

_See code: [src/commands/add.ts](https://github.com/matsuri-tech/endpoints-sdk-cli/blob/v2.6.0/src/commands/add.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.3.1/src/commands/help.ts)_

## `mes install`

generate endpoints files based on endpoints.config.json

```
USAGE
  $ mes install
```

_See code: [src/commands/install.ts](https://github.com/matsuri-tech/endpoints-sdk-cli/blob/v2.6.0/src/commands/install.ts)_

## `mes update [SERVICE]`

update service version & regenerate endpoints files

```
USAGE
  $ mes update [SERVICE]
```

_See code: [src/commands/update.ts](https://github.com/matsuri-tech/endpoints-sdk-cli/blob/v2.6.0/src/commands/update.ts)_
<!-- commandsstop -->


# Support of `create-react-app`

```json
{
  "environment_identifier": "process.env.REACT_APP_ENV",
}
```

# Override root url

```json
{
  "dependencies": {
    "my-service": {
      "version": "ba832b61d0319f42b3cbb30c815cbdecfece959a",
      "repository": "git@github.com:hoge/my-service.git",
      "roots":{
        "dev": "https://dev.hoge.com",
        "prod": "https://hoge.com",
        "local": "http://localhost:3000"
      }
    },
  }
}
```

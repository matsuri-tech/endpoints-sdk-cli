# matsuri-tech/endpoints-sdk-cli (mes)

Endpoints SDK for JavaScript

## Usage

```shell
pnpm add -D endpoints-sdk-cli
npx mes --help
```

## Commands

- [`mes init`](#mes-init)
- [`mes add [REPOSITORY]`](#mes-add-repository)
- [`mes install`](#mes-install)
- [`mes update [SERVICE]`](#mes-update-service)

### `mes init`

initialize endpoints.config.json

```shell
npx mes init
```

### `mes add [REPOSITORY]`

add service to dependencies & make endpoints files.

```shell
npx mes add [REPOSITORY]
```

Examples:

```shell
mes add [username/repository_name]
mes add [username/repository_name] -b [branch_name]
mes add [username/repository_name] -w [workspace_name]
mes add [username/repository_name] -e [period_name]
```

### `mes install`

generate endpoints files based on endpoints.config.json

```shell
npx mes install
```

### `mes update [SERVICE]`

update service version & regenerate endpoints files

```shell
npx mes update [SERVICE]
```

## Support of `create-react-app`

```json
{
  "environment_identifier": "process.env.REACT_APP_ENV"
}
```

## Override root url

```json
{
  "dependencies": {
    "my-service": {
      "version": "ba832b61d0319f42b3cbb30c815cbdecfece959a",
      "repository": "git@github.com:hoge/my-service.git",
      "roots": {
        "dev": "https://dev.hoge.com",
        "prod": "https://hoge.com",
        "local": "http://localhost:3000"
      }
    }
  }
}
```

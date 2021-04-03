s3-janitor
==========

CLI utility to take care of orphaned S3 buckets left by Cloudformation

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/s3-janitor.svg)](https://npmjs.org/package/s3-janitor)
[![Downloads/week](https://img.shields.io/npm/dw/s3-janitor.svg)](https://npmjs.org/package/s3-janitor)
[![License](https://img.shields.io/npm/l/s3-janitor.svg)](https://github.com/jensgerdes/s3-janitor/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g s3-janitor
$ janitor COMMAND
running command...
$ janitor (-v|--version|version)
s3-janitor/0.1.0 darwin-x64 node-v14.16.0
$ janitor --help [COMMAND]
USAGE
  $ janitor COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`janitor list-orphans`](#janitor-list-orphans)
* [`janitor help [COMMAND]`](#janitor-help-command)

## `janitor list-orphans`

Lists all S3 Buckets not referenced in a CF / CDK Stack.

```
USAGE
  $ janitor list-orphans

OPTIONS
  -h, --help       show CLI help

EXAMPLE
  $ janitor listOrphans
  - bucketA
  - bucketB
```

_See code: [src/commands/list-orphans.ts](https://github.com/jensgerdes/s3-janitor/blob/main/src/commands/list-orphans.ts)_

## `janitor help [COMMAND]`

display help for janitor

```
USAGE
  $ janitor help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

## License
s3-janitor is licensed under the MIT License.

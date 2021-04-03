s3-janitor
==========

CLI utility to take care of orphaned S3 buckets left by Cloudformation

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/s3-janitor.svg)](https://npmjs.org/package/s3-janitor)
[![Downloads/week](https://img.shields.io/npm/dw/s3-janitor.svg)](https://npmjs.org/package/s3-janitor)
[![License](https://img.shields.io/npm/l/s3-janitor.svg)](https://github.com/jensgerdes/s3-janitor/blob/master/package.json)

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
* [`janitor hello [FILE]`](#janitor-hello-file)
* [`janitor help [COMMAND]`](#janitor-help-command)

## `janitor hello [FILE]`

describe the command here

```
USAGE
  $ janitor hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ janitor hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/jensgerdes/s3-janitor/blob/v0.1.0/src/commands/hello.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->

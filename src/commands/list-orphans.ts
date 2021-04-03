import {Command, flags} from '@oclif/command'

export default class ListOrphans extends Command {
  static description = 'lists all S3 Buckets not referenced in a CF / CDK Stack'

  static examples = [
    `$ janitor listOrphans
bucketA
bucketB
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ListOrphans)
    this.log('hello from ./src/commands/list-orphans.ts')
  }
}

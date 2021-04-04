import {Command, flags} from '@oclif/command'
import StackRepository from '../repositories/stack-repository'

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
    const result = await new StackRepository().listReferencedBuckets()
    this.log(JSON.stringify(result))
  }
}

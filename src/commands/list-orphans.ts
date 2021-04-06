/* eslint-disable no-console */
import {Command, flags} from '@oclif/command'
import Service from '../service'

export default class ListOrphans extends Command {
  static description = 'lists all S3 Buckets not referenced in a CF / CDK Stack'

  static examples = [
    `$ janitor list-orphans
bucketA
bucketB
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(ListOrphans)
    this.log('---------------------------------------------')
    this.log(' This operation takes very long. Be patient!')
    this.log('---------------------------------------------')
    this.log()

    const result = await new Service().listOrphans()

    this.log(`TOTAL Buckets: ${result.stats.totalBuckets}`)
    this.log(`Referenced Buckets: ${result.stats.referencedBuckets}`)
    this.log(`Orphaned Buckets: ${result.stats.orphanedBuckets}`)
    console.log(result.orphans)
  }
}

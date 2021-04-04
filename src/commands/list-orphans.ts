/* eslint-disable no-console */
import {Command, flags} from '@oclif/command'
import StackRepository from '../repositories/stack-repository'
import BucketRepository from '../repositories/bucket-repository'

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

    const allBuckets = await new BucketRepository().listAllBuckets()
    const referencedBuckets = await new StackRepository().listReferencedBuckets()
    const existingReferencedBuckets = allBuckets.filter(_ => referencedBuckets.includes(_))
    const orphans = allBuckets.filter(_ => !existingReferencedBuckets.includes(_))

    this.log(`TOTAL Buckets: ${allBuckets.length}`)
    this.log(`Referenced Buckets: ${existingReferencedBuckets.length}`)
    this.log(`Orphaned Buckets: ${orphans.length}`)
    this.log()
    console.log(orphans)
  }
}

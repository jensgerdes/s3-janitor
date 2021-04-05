/* eslint-disable no-console */
import {Command, flags} from '@oclif/command'
import StackRepository from '../repositories/stack-repository'
import BucketRepository from '../repositories/bucket-repository'

export default class RemoveOrphans extends Command {
  static description = 'removes all orphaned S3 Buckets recursively'

  static examples = [
    '$ janitor remove-orphans',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(RemoveOrphans)
    const br = new BucketRepository()
    const allBuckets = await br.listAllBuckets()
    const referencedBuckets = await new StackRepository().listReferencedBuckets()
    const existingReferencedBuckets = allBuckets.filter(_ => referencedBuckets.includes(_))
    const orphans = allBuckets.filter(_ => !existingReferencedBuckets.includes(_))

    for (const orphan of orphans) {
      // eslint-disable-next-line no-await-in-loop
      await br.deleteBucket(orphan)
    }
  }
}

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
    await new BucketRepository().deleteBucket('cf-templates-ooi4s4rza1xz-eu-central-1')
  }
}

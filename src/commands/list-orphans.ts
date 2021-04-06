/* eslint-disable no-console */
import {Command} from '@oclif/command'
import Service from '../service'
import * as Config from '@oclif/config'

export default class ListOrphans extends Command {
  static description = 'Lists all S3 Buckets not referenced in a CF / CDK Stack'

  readonly #service: Service

  constructor(argv: string[], config: Config.IConfig) {
    super(argv, config)
    this.#service = new Service()
  }

  async run() {
    this.parse(ListOrphans)
    const result = await this.#service.listOrphans()

    this.log(`TOTAL Buckets: ${result.stats.totalBuckets}`)
    this.log(`Referenced Buckets: ${result.stats.referencedBuckets}`)
    this.log(`Orphaned Buckets: ${result.stats.orphanedBuckets}`)
    console.log(result.orphans)
  }
}

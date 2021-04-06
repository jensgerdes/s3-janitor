// Let AWS-SDK read configuration from local settings
process.env.AWS_SDK_LOAD_CONFIG = 'true'

import * as ora from 'ora'
import {Ora} from 'ora'
import {CloudFormation, S3} from 'aws-sdk'
import BucketRepository from './repositories/bucket-repository'
import StackRepository from './repositories/stack-repository'
import OrphanSummary from './entities/orphan-summary'

export default class Service {
  #bucketRepository: BucketRepository

  #stackRepository: StackRepository

  constructor() {
    const cf = new CloudFormation({
      maxRetries: 50,
      retryDelayOptions: {base: 300},
    })

    this.#bucketRepository = new BucketRepository(new S3())
    this.#stackRepository = new StackRepository(cf)
  }

  async listOrphans(): Promise<OrphanSummary> {
    const spinner = Service.initSpinner()

    try {
      return await this.listOrphansInternal(spinner)
    } finally {
      spinner.stop()
    }
  }

  async removeOrphans(): Promise<OrphanSummary> {
    const spinner = Service.initSpinner()

    try {
      const result = await this.listOrphansInternal(spinner)

      for (const orphan of result.orphans) {
        spinner.text = `Removing bucket "${orphan}"...`
        // eslint-disable-next-line no-await-in-loop
        await this.#bucketRepository.deleteBucket(orphan)
      }

      return result
    } finally {
      spinner.stop()
    }
  }

  private static initSpinner(): Ora {
    return ora({
      spinner: 'dots',
      color: 'magenta',
    }).start()
  }

  private async listOrphansInternal(spinner: ora.Ora): Promise<OrphanSummary> {
    spinner.text = 'Analyzing S3 buckets...'
    const allBuckets = await this.#bucketRepository.listAllBuckets()
    const referencedBuckets = await this.#stackRepository.listReferencedBuckets(spinner)

    spinner.text = 'Filtering bucket references...'
    const existingReferencedBuckets = allBuckets.filter(_ => referencedBuckets.includes(_))

    spinner.text = 'Comparing buckets with Cloudformation references...'
    const orphans = allBuckets.filter(_ => !existingReferencedBuckets.includes(_))

    return {
      orphans,
      stats: {
        orphanedBuckets: orphans.length,
        totalBuckets: allBuckets.length,
        referencedBuckets: existingReferencedBuckets.length,
      },
    }
  }
}

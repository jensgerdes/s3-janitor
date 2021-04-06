// Let AWS-SDK read configuration from local settings
process.env.AWS_SDK_LOAD_CONFIG = 'true'

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
    const allBuckets = await this.#bucketRepository.listAllBuckets()
    const referencedBuckets = await this.#stackRepository.listReferencedBuckets()
    const existingReferencedBuckets = allBuckets.filter(_ => referencedBuckets.includes(_))
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

  async removeOrphans(): Promise<OrphanSummary> {
    const result = await this.listOrphans()

    for (const orphan of result.orphans) {
      // eslint-disable-next-line no-await-in-loop
      await this.#bucketRepository.deleteBucket(orphan)
    }

    return result
  }
}

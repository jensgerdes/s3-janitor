import {S3} from 'aws-sdk'
import {ObjectIdentifier} from 'aws-sdk/clients/s3'

export default class BucketRepository {
  readonly #s3: S3

  constructor(client: S3) {
    this.#s3 = client
  }

  async listAllBuckets(): Promise<string[]> {
    const response = await this.#s3.listBuckets().promise()
    return response.Buckets!.map(_ => _.Name!)
  }

  async deleteBucket(name: string) {
    await this.emptyBucket(name)
    await this.#s3.deleteBucket({Bucket: name}).promise()
  }

  private async emptyBucket(name: string) {
    const iterator = async (ContinuationToken?: string) => {
      const objects = await this.#s3.listObjectsV2({
        ContinuationToken,
        Bucket: name,
      }).promise()

      if (!objects.Contents?.length)
        return

      const keys: ObjectIdentifier[] = []
      objects.Contents.forEach(_ => keys.push({Key: _.Key!}))

      await this.#s3.deleteObjects({
        Bucket: name,
        Delete: {
          Objects: keys,
        },
      }).promise()

      if (objects.NextContinuationToken) {
        await iterator(objects.NextContinuationToken)
      }
    }

    return iterator()
  }
}

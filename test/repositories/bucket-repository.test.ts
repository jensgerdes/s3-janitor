import {S3} from 'aws-sdk'
import BucketRepository from '../../src/repositories/bucket-repository'
import {ListObjectsV2Output} from 'aws-sdk/clients/s3'

const mockListBuckets = (client: S3, buckets: string[]) => {
  const mappedBuckets = buckets.map(name => ({Name: name}))
  const mockResult = jest.fn().mockResolvedValue({
    Buckets: mappedBuckets,
  })

  client.listBuckets = jest.fn()
    .mockImplementation(() => ({promise: mockResult}))
}

const mockBucketWithContent = (client: S3, values: ListObjectsV2Output[], continueToken = '', moreValues: ListObjectsV2Output[] = []) => {
  const firstResult = {Contents: values, NextContinuationToken: continueToken}
  const promiseList1 = () => Promise.resolve(firstResult)
  const promiseList2 = () => Promise.resolve({Contents: moreValues})
  const promiseDelete = () => Promise.resolve()

  client.listObjectsV2 = jest.fn()
    .mockImplementationOnce(() => ({promise: promiseList1}))
    .mockImplementationOnce(() => ({promise: promiseList2}))
  client.deleteObjects = jest.fn().mockImplementation(() => ({promise: promiseDelete}))
}

const mockEmptyBucket = (client: S3) => {
  mockBucketWithContent(client, [])
}

const mockBucketAndContentWithoutPaging = (client: S3, files: string[]) => {
  const values: ListObjectsV2Output[] = files.map(key => ({Key: key})) as ListObjectsV2Output[]
  mockBucketWithContent(client, values)
}

const mockBucketAndContentWithPaging = (client: S3, files: string[], token: string, files2: string[]) => {
  const values: ListObjectsV2Output[] = files.map(key => ({Key: key})) as ListObjectsV2Output[]
  const moreValues: ListObjectsV2Output[] = files2.map(key => ({Key: key})) as ListObjectsV2Output[]
  mockBucketWithContent(client, values, token, moreValues)
}

const mockBucketAndUnexpectedContent = (client: S3) => {
  const promise = () => Promise.resolve({})
  client.listObjectsV2 = jest.fn().mockImplementation(() => ({promise}))
  client.deleteObjects = jest.fn()
}

const mockBucketDeletion = (client: S3) => {
  const promise = () => Promise.resolve()
  client.deleteBucket = jest.fn().mockImplementation(() => ({promise}))
}

describe('BucketRepository', () => {
  describe('listAllBuckets()', () => {
    it('should return a list of bucket names', async () => {
      // given
      const s3Client = new S3()
      const subject = new BucketRepository(s3Client)

      const buckets = [
        'bucket1',
        'bucket2',
        'bucket3',
      ]

      mockListBuckets(s3Client, buckets)

      // when
      const actualResult = await subject.listAllBuckets()

      // then
      expect(actualResult).toHaveLength(buckets.length)
      buckets.forEach(bucket => {
        expect(actualResult).toContain(bucket)
      })
    })

    it('should not catch exceptions', async () => {
      // given
      const s3Client = new S3()
      const subject = new BucketRepository(s3Client)
      const expectedError = new Error('S3-Call failed...')
      const expectedResult = Promise.reject(expectedError)

      s3Client.listBuckets = jest.fn().mockReturnValue({promise: () => expectedResult})

      // expect
      expect.assertions(1)
      await expect(() => subject.listAllBuckets())
        .rejects
        .toThrowError(expectedError)
    })
  })

  describe('deleteBucket()', () => {
    it('should delete the empty bucket', async () => {
      // given
      const bucketName = 'empty-bucket'
      const s3Client = new S3()
      const subject = new BucketRepository(s3Client)

      mockEmptyBucket(s3Client)
      mockBucketDeletion(s3Client)

      // when
      await subject.deleteBucket(bucketName)

      // then
      expect(s3Client.listObjectsV2).toBeCalledTimes(1)
      expect(s3Client.deleteObjects).not.toBeCalled()
      expect(s3Client.deleteBucket).toBeCalledWith({Bucket: bucketName})
    })

    it('should delete the bucket recursively', async () => {
      // given
      const bucketName = 'non-empty-bucket'
      const s3Client = new S3()
      const subject = new BucketRepository(s3Client)
      const files = [
        'file/a',
        'file/b',
        'c',
      ]
      const expectedKeys = files.map(_ => ({Key: _}))

      mockBucketAndContentWithoutPaging(s3Client, files)
      mockBucketDeletion(s3Client)

      // when
      await subject.deleteBucket(bucketName)

      // then
      expect(s3Client.listObjectsV2).toBeCalledTimes(1)
      expect(s3Client.deleteBucket).toBeCalledWith({Bucket: bucketName})
      expect(s3Client.deleteObjects).toBeCalledWith({
        Bucket: bucketName,
        Delete: {
          Objects: expectedKeys,
        },
      })
    })

    it('should delete the bucket recursively with paging', async () => {
      // given
      const bucketName = 'paging-bucket'
      const s3Client = new S3()
      const subject = new BucketRepository(s3Client)
      const expectedToken = 'ncef49fc49h'
      const files = [
        'file/a',
        'file/b',
      ]
      const files2 = ['c,']
      const expectedKeys = files.map(_ => ({Key: _}))
      const expectedKeys2 = files2.map(_ => ({Key: _}))

      mockBucketAndContentWithPaging(s3Client, files, expectedToken, files2)
      mockBucketDeletion(s3Client)

      // when
      await subject.deleteBucket(bucketName)

      // then
      expect(s3Client.listObjectsV2).toBeCalledTimes(2)
      expect(s3Client.deleteBucket).toBeCalledWith({Bucket: bucketName})
      expect(s3Client.deleteObjects).toBeCalledTimes(2)
      expect(s3Client.deleteObjects).toBeCalledWith({
        Bucket: bucketName,
        Delete: {
          Objects: expectedKeys,
        },
      })
      expect(s3Client.deleteObjects).toBeCalledWith({
        Bucket: bucketName,
        Delete: {
          Objects: expectedKeys2,
        },
      })
    })

    it('should be able to handle unexpected responses', async () => {
      // given
      const bucketName = 'unexpected-bucket'
      const s3Client = new S3()
      const subject = new BucketRepository(s3Client)

      mockBucketAndUnexpectedContent(s3Client)
      mockBucketDeletion(s3Client)

      // when
      await subject.deleteBucket(bucketName)

      // then
      expect(s3Client.listObjectsV2).toBeCalledTimes(1)
      expect(s3Client.deleteBucket).toBeCalledWith({Bucket: bucketName})
      expect(s3Client.deleteObjects).not.toBeCalled()
    })
  })
})

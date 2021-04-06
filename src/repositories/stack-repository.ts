import {StackResourceSummaries, StackResourceSummary, StackSummaries} from 'aws-sdk/clients/cloudformation'
import {CloudFormation} from 'aws-sdk'

export default class StackRepository {
  readonly #cf: CloudFormation

  constructor(cf: CloudFormation) {
    this.#cf = cf
  }

  private async listStacks(): Promise<StackSummaries> {
    const iterator = async (token?: string): Promise<StackSummaries> => {
      const stacks = await this.#cf.listStacks({
        NextToken: token,
      }).promise()

      if (stacks.NextToken) {
        const nextPage = await iterator(stacks.NextToken)
        return [
          ...stacks.StackSummaries!,
          ...nextPage,
        ]
      }
      return stacks.StackSummaries ? stacks.StackSummaries : []
    }

    const allStacks = await iterator()
    return allStacks.filter(stack => stack.StackStatus !== 'DELETE_COMPLETE')
  }

  private async listStackResources(stackName: string): Promise<StackResourceSummaries> {
    const iterator = async (NextToken?: string): Promise<StackResourceSummaries> => {
      const r = await this.#cf.listStackResources({
        StackName: stackName,
        NextToken,
      }).promise()
      if (r.NextToken) {
        const nextPage = await iterator(r.NextToken)
        return [
          ...r.StackResourceSummaries!,
          ...nextPage,
        ]
      }
      return r.StackResourceSummaries!
    }

    return iterator()
  }

  async listReferencedBuckets(): Promise<string[]> {
    const stacks = await this.listStacks()
    const buckets: string[] = []
    for (const stack of stacks) {
      // AWS is throttling it's API. Therefore, we need to perform calls one by one - possibly retrying failed ones.
      // eslint-disable-next-line no-await-in-loop
      const resources = await this.listStackResources(stack.StackName)
      resources.forEach(resource => {
        if (this.isBucket(resource))
          buckets.push(resource.PhysicalResourceId!)
      })
    }

    return buckets
  }

  private isBucket = (resource: StackResourceSummary) => {
    return resource &&
      resource.PhysicalResourceId &&
      resource.ResourceType === 'AWS::S3::Bucket'
  }
}

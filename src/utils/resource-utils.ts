import {StackResourceSummary} from 'aws-sdk/clients/cloudformation'

export const isBucket = (resource: StackResourceSummary) => {
  return resource &&
    resource.PhysicalResourceId &&
    resource.ResourceType === 'AWS::S3::Bucket'
}

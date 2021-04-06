/* eslint-disable no-console */
import {Command} from '@oclif/command'
import Service from '../service'
import * as Config from '@oclif/config'

export default class RemoveOrphans extends Command {
  static description = 'Removes all orphaned S3 Buckets recursively'

  readonly #service: Service

  constructor(argv: string[], config: Config.IConfig) {
    super(argv, config)
    this.#service = new Service()
  }

  async run() {
    this.parse(RemoveOrphans)
    await this.#service.removeOrphans()
  }
}

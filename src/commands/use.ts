import assert from 'assert'
import Connectors from '../connectors'
import Config from '../libs/Config'
import Vomit from '../libs/Vomit'

export default function UseCommand(connector: IFndrConnector): IFndrCommand {
  return {
    name: 'use',

    help() {
      return `Show an account based on its name or ID in your fndr database.`
    },

    options() {
      return [
        {
          flag: '-c, --connector <connector>',
          desc: 'the new connector you want to use.',
          isRequired: true,
        },
      ]
    },

    async execute(currentConfig: string, options: any) {
      let { connector: conn } = options
      const configInst = Config(connector.name)

      conn = conn.toLowerCase()

      const allSupportConnectors = Object.keys(Connectors)
      assert(
        allSupportConnectors.includes(conn),
        `Supported connectors are:\n\n${allSupportConnectors.join('\n')}`
      )

      await configInst.changeConnector(conn)
      return conn
    },

    async runCli(currentConfig: string, options: any) {
      const conn = await this.execute(currentConfig, options)
      Vomit.success(`Successfully changed connector to '${conn}'!`)
    },
  }
}

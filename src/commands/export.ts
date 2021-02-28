import { sortByName } from './search'
import Config from '../libs/Config'
import Vomit from '../libs/Vomit'

export default function ConnectorCommand(
  connector: IFndrConnector
): IFndrCommand {
  return {
    name: 'export',

    help() {
      return `Export all your accounts to a JSON file on your machine.`
    },

    options() {
      return []
    },

    async execute(currentConfig: string) {
      const configInst = Config(connector.name)
      const allAccounts = await connector.getAllAccounts(currentConfig)
      const accountsSorted = allAccounts
        .sort(sortByName)
        .reduce((acc: IFndrAccount[], val: IFndrAccount) => {
          if (acc.indexOf(val) === -1) acc.push(val)
          return acc
        }, [])
      const filePath = await configInst.exportAccounts(accountsSorted)
      return filePath
    },

    async runCli(currentConfig) {
      Vomit.twoLinesDifferentColors(
        `You're export was created in the following location.\nNOTE: this contains your account information unencrypted so keep it in a safe place!\n`,
        await this.execute(currentConfig),
        'red',
        'red'
      )
    },
  }
}

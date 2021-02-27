import Config from '../libs/Config'
import Vomit from '../libs/Vomit'

export default function ConnectorCommand(
  connector: IFndrConnector
): IFndrCommand {
  return {
    name: 'connector',

    help() {
      return `Show the current connector being used.`
    },

    options() {
      return []
    },

    async run() {
      Vomit.success(connector.name)
    },
  }
}

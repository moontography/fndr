import Config from '../libs/Config'
import Vomit from '../libs/Vomit'

export default function FileCommand(connector: IFndrConnector): IFndrCommand {
  return {
    name: 'file',

    help() {
      return `Show the destination of the config file for this connector on your machine.`
    },

    options() {
      return []
    },

    async execute() {
      return Config(connector.name).confFile
    },

    async runCli() {
      Vomit.twoLinesDifferentColors(
        `Your configuration file is in the following location:`,
        await this.execute(''),
        'blue',
        'green'
      )
    },
  }
}

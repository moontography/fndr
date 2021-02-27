import Config from '../libs/Config'
import FileManagement from '../libs/FileManagement'
import Vomit from '../libs/Vomit'

const fileMgmt = FileManagement()

export default function ConfigCommand(connector: IFndrConnector): IFndrCommand {
  const config = Config(connector.name)

  return {
    name: 'config',

    help() {
      return `Configure fndr with the settings to ensure account information is stored where and how you expect.`
    },

    async run(currentConfig) {
      const newConfStr = await connector.config(currentConfig)
      await fileMgmt.writeFile(config.confFile, newConfStr)
      Vomit.success('Successfully updated your fndr configuration!')
    },
  }
}

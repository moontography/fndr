import inquirer from 'inquirer'
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

    async execute(currentConfig: string) {
      const newConfStr = await connector.config(currentConfig)
      await fileMgmt.writeFile(config.confFile, newConfStr)
      Vomit.success(`Successfully updated your fndr configuration!`)

      const { shouldShow } = await inquirer.prompt([
        {
          name: 'shouldShow',
          message: `Would you like to print out your config now so you can back it up?`,
          type: 'confirm',
          default: false,
        },
      ])
      return [newConfStr, shouldShow]
    },

    async runCli(currentConfig: string) {
      const [newConfStr, shouldShow] = await this.execute(currentConfig)
      if (shouldShow) {
        Vomit.twoLinesDifferentColors(
          `Here is your config, store it in a safe place if you need to recover it later:`,
          newConfStr,
          'blue',
          'green'
        )
      }
    },
  }
}

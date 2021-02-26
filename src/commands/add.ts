import inquirer from 'inquirer'
import { v1 as uuidv1 } from 'uuid'
import Vomit from '../libs/Vomit'

export default function AddCommand(connector: IFndrConnector): IFndrCommand {
  return {
    name: 'add',

    help() {
      return `Add new account to fndr database.`
    },

    options() {
      return [
        {
          flag: '-n, --name <name>',
          desc: 'the account name to add',
          isRequired: true,
        },
        {
          flag: '-u, --username <username>',
          desc: 'the username for the account',
        },
        {
          flag: '-e, --extra <extra>',
          desc: 'any extra information to add about the account',
        },
      ]
    },

    async run(currentConfig: string, options: any) {
      let account: IFndrAccount = {
        id: options.id || uuidv1(),
        name: options.name,
        username: options.username,
        extra: options.extra,
      }

      const { password } = await inquirer.prompt([
        {
          name: 'password',
          message: `The password for account: ${account.name}.`,
          type: 'password',
          default: '',
        },
      ])
      account.password = password || undefined

      await connector.addAccount(currentConfig, account)
      Vomit.success(`Successfully added account '${account.name}'!`)
    },
  }
}

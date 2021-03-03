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

    async execute(currentConfig: string, options: any) {
      let account: IFndrAccount = {
        id: uuidv1(),
        name: options.name,
        username: options.username,
        password: options.password,
        extra: options.extra,
      }

      if (options.isCli) {
        const { password } = await inquirer.prompt([
          {
            name: 'password',
            message: `The password for account: ${account.name}.`,
            type: 'password',
            default: '',
          },
        ])
        account.password = password || undefined
      }

      await connector.addAccount(currentConfig, account)
      return account
    },

    async runCli(currentConfig: string, options: any) {
      const account = await this.execute(currentConfig, {
        ...options,
        isCli: true,
      })
      Vomit.success(`Successfully added account '${account.name}'!`)
    },
  }
}

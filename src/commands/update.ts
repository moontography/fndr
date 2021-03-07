import assert from 'assert'
import inquirer from 'inquirer'
import Vomit from '../libs/Vomit'

export default function UpdateCommand(connector: IFndrConnector): IFndrCommand {
  return {
    name: 'update',

    help() {
      return `Update an existing account from the fndr database.`
    },

    options() {
      return [
        {
          flag: '-i, --id <id>',
          desc: 'the ID of your account to delete.',
        },
        {
          flag: '-n, --name <name>',
          desc: 'the account name to add',
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
      const { name, id, username, password, extra } = options
      if (!(name || id)) {
        throw new Error(`At least a name or ID is required to get an account.`)
      }
      const matches = await connector.getAllAccounts(currentConfig)

      let account = matches.find((a) => a.id === id || a.name === name)
      assert(account, `We didn't find the account you're trying to update.`)

      account = {
        ...account,
        name: name || account.name,
        username: username || account.username,
        extra: extra || account.extra,
        password: password || account.password,
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

      await connector.updateAccount(currentConfig, account)
      return account
    },

    async runCli(currentConfig: string, options: any) {
      const account = await this.execute(currentConfig, {
        ...options,
        isCli: true,
      })
      return Vomit.success(`Successfully updated account: '${account.name}'!`)
    },
  }
}

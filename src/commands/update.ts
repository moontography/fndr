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

    async run(currentConfig: string, options: any) {
      try {
        const { name, id, username, extra } = options
        if (!(name || id)) {
          throw new Error(
            `At least a name or ID is required to get an account.`
          )
        }
        const matches = await connector.getAllAccounts(currentConfig)

        let account = matches.find((a) => a.id === id || a.name === name)
        assert(account, `We didn't find the account you're trying to update.`)

        const { password } = await inquirer.prompt([
          {
            name: 'password',
            message: `The password for account (leave blank if unchanged): ${account.name}.`,
            type: 'password',
            default: '',
          },
        ])

        await connector.updateAccount(currentConfig, {
          ...account,
          name: name || account.name,
          username: username || account.username,
          extra: extra || account.extra,
          password: password || account.password,
        })
        return Vomit.success(
          `Successfully updated account: '${name || account.name}'!`
        )
      } catch (err) {
        Vomit.error(`${err.name} - ${err.message}`)
      }
    },
  }
}

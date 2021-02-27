import assert from 'assert'
import Vomit from '../libs/Vomit'

export default function ShowCommand(connector: IFndrConnector): IFndrCommand {
  return {
    name: 'show',

    help() {
      return `Show an account based on its name or ID in your fndr database.`
    },

    options() {
      return [
        {
          flag: '-n, --name <name>',
          desc: 'the name of your account.',
        },
        {
          flag: '-i, --id <id>',
          desc: 'the ID of your account.',
        },
        {
          flag: '-p, --password',
          desc: 'include the password of your account in the terminal.',
        },
        {
          flag: '-P --password-only',
          desc: 'only output the password, good for piping to other commands.',
        },
      ]
    },

    async run(currentConfig: string, options: any) {
      try {
        const { name, id, password, passwordOnly } = options
        if (!(name || id)) {
          throw new Error(
            `At least a name or ID is required to get an account.`
          )
        }

        let account = await connector.getAccount(currentConfig, options)
        if (passwordOnly) {
          process.stdout.write(account.password || '')
          return
        }
        if (!password) {
          delete account.password
        }
        Vomit.listSingleAccount(account)
      } catch (err) {
        Vomit.error(`${err.name} - ${err.message}`)
      }
    },
  }
}

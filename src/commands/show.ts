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

    async execute(currentConfig: string, options: any) {
      const { name, id, password, passwordOnly } = options
      if (!(name || id)) {
        throw new Error(`At least a name or ID is required to get an account.`)
      }

      let account = await connector.getAccount(
        currentConfig,
        options,

        // provides a way to pass a list of accounts to override in #getAccount
        // instead of getting all accounts and filtering from them
        options.accountListOverride
      )
      if (passwordOnly) {
        process.stdout.write(account.password || '')
        return false
      }
      if (!password) {
        delete account.password
      }
      return account
    },

    async runCli(currentConfig: string, options: any) {
      const account = await this.execute(currentConfig, options)
      if (!account) return
      Vomit.listSingleAccount(account)
    },
  }
}

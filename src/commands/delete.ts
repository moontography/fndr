import Vomit from '../libs/Vomit'

export default function DeleteCommand(connector: IFndrConnector): IFndrCommand {
  return {
    name: 'delete',

    help() {
      return `Delete an account from the fndr database.`
    },

    options() {
      return [
        {
          flag: '-i, --id <id>',
          desc: 'the ID of your account to delete.',
          isRequired: true,
        },
      ]
    },

    async execute(currentConfig: string, options: any) {
      await connector.deleteAccount(currentConfig, options.id)
    },

    async runCli(currentConfig: string, options: any) {
      await this.execute(currentConfig, options)
      Vomit.success(`Successfully deleted account '${options.id}'.`)
    },
  }
}

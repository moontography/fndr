import assert from 'assert'
import inquirer from 'inquirer'
import { v1 as uuidv1 } from 'uuid'
import AccountMgmt from './AccountMgmt'
import FileHandler from './FileHandler'

export default FileSystemConnector()

function FileSystemConnector(): IFndrConnector {
  return {
    name: 'filesystem',
    async config(config: string): Promise<string> {
      const currentConfig = JSON.parse(config || '{}')
      let updatedConfig = await inquirer.prompt([
        {
          name: 'encryptSecret',
          message: `The encryption secret (any alphanumeric characters you'd like) that will be used to encrypt record information.`,
          type: 'input',
          default: currentConfig.encryptSecret || uuidv1(),
        },
      ])

      return JSON.stringify(updatedConfig, null, 2)
    },

    async isConfigValid(config: string): Promise<boolean> {
      return !!JSON.parse(config).encryptSecret
    },

    async getAllAccounts(config: string): Promise<IFndrAccount[]> {
      const currentConfig = JSON.parse(config)
      const fileHandler = FileHandler(this, currentConfig.encryptSecret)
      const accountsMap = await fileHandler.getAndDecryptFlatFile()
      return Object.keys(accountsMap).reduce(
        (ary: IFndrAccount[], id: string) =>
          ary.concat([{ ...accountsMap[id], id }]),
        []
      )
    },

    async getAccount(
      config: string,
      opts: IGetAccountOpts
    ): Promise<IFndrAccount> {
      const { id: uid, name } = opts
      const currentConfig = JSON.parse(config)
      const accountMgmt = AccountMgmt(this, currentConfig.encryptSecret)

      if (uid) {
        const account = await accountMgmt.findAccountByUuid(uid)
        assert(account, `We didn't find an account with uuid: ${uid}`)
        return account
      } else if (name) {
        const nameStringToTry = name
        const account = await accountMgmt.findAccountByName(nameStringToTry)
        assert(account, `We didn't find an account with name: ${name}`)
        return account
      }

      throw new Error(
        'Either a name (-n or --name) or uuid (-i or --id or --uuid) parameter is a required at a minimum to show the details for an account.'
      )
    },

    async addAccount(config: string, acc: IFndrAccount): Promise<void> {
      const currentConfig = JSON.parse(config)
      const accountMgmt = AccountMgmt(this, currentConfig.encryptSecret)
      const { name, username, password, extra } = acc
      await accountMgmt.addAccount(name, username, password, extra)
    },

    async updateAccount(config: string, acc: IFndrAccount): Promise<void> {
      const { id, name } = acc
      const currentConfig = JSON.parse(config)
      const accountMgmt = AccountMgmt(this, currentConfig.encryptSecret)
      let account
      if (id) {
        account = await accountMgmt.findAccountByUuid(id)
      } else if (name) {
        account = await accountMgmt.findAccountByName(name)
      }

      assert(account, `We didn't find the account to update.`)
      await accountMgmt.updateAccount(id, acc, account)
    },

    async deleteAccount(config: string, id: string): Promise<void> {
      const currentConfig = JSON.parse(config)
      const accountMgmt = AccountMgmt(this, currentConfig.encryptSecret)
      assert(
        await accountMgmt.deleteAccountByUuid(id),
        `We didn't find an account with uuid: '${id}'`
      )
    },
  }
}

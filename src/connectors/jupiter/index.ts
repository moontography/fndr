import inquirer from 'inquirer'
import JupiterClient from './JupiterClient'

export default JupiterConnector()

export function JupiterConnector(): IFndrConnector {
  return {
    async config(currentConfigStr: string) {
      const currentConfig = JSON.parse(currentConfigStr || '{}')
      const response = await inquirer.prompt([
        {
          name: 'jupiterServer',
          message: `The Jupiter blockchain server URL.`,
          type: 'input',
          default: currentConfig.jupiterServer || 'https://jpr.gojupiter.tech',
        },
        {
          name: 'fundedAddress',
          message: `The funded 'JUP-' address that we'll use to transact and add encrypted account information to the Jupiter blockchain.`,
          type: 'input',
          default: currentConfig.fundedAddress || '',
        },
        {
          name: 'fundedAddressPassphrase',
          message: `The funded 'JUP-' address' passphrase. This is needed to allow funding your fndr address that stores your accounts.`,
          type: 'password',
          default: currentConfig.fundedAddressPassphrase || '',
        },
        {
          name: 'encryptSecret',
          message: `The encryption secret (any alphanumeric characters you'd like) that will be used to encrypt record information before we send it to the blockchain.`,
          type: 'password',
          default: currentConfig.encryptSecret || '',
        },
      ])
      return JSON.stringify(response, null, 2)
    },
    async searchAccounts(query: string) {
      return []
    },
    async getAccount(opts: IGetAccountOpts) {
      return {
        name: '',
        username: '',
        password: '',
      }
    },
    async addAccount(acc: IFndrAccount) {},
    async updateAccount(acc: IFndrAccount) {},
    async deleteAccount(id: string) {},
  }
}

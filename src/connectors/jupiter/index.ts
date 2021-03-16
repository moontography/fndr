import assert from 'assert'
import inquirer from 'inquirer'
import { v1 as uuidv1 } from 'uuid'
import JupiterClient, { generatePassphrase } from 'jupiter-node-sdk'

export default JupiterConnector()

export function JupiterConnector(): IFndrConnector {
  return {
    name: 'jupiter',

    async config(config: string) {
      const currentConfig = JSON.parse(config || '{}')
      let updatedConfig = await inquirer.prompt([
        {
          name: 'jupiterServer',
          message: `The Jupiter blockchain server URL.`,
          type: 'input',
          default: currentConfig.jupiterServer || 'https://jpr.gojupiter.tech',
        },
        {
          name: 'fundedAddress',
          message: `The funded 'JUP-XXX' address that we'll use to transact and add encrypted account information to the Jupiter blockchain.`,
          type: 'input',
          default: currentConfig.fundedAddress || '',
        },
        {
          name: 'fundedAddressPassphrase',
          message: `The funded 'JUP-XXX' address passphrase. This is needed to allow funding your fndr address that stores your accounts.`,
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

      if (!currentConfig.fndrAddress) {
        // set defaults for the fndrAddress which is used to store accounts
        updatedConfig = {
          ...updatedConfig,
          fndrAddress: updatedConfig.fundedAddress,
          fndrSecretPhrase: updatedConfig.fundedAddressPassphrase,
          // fndrPublicKey: publicKey,
          // fndrAccount: account,
        }

        const { allowAccountAddressCreation } = await inquirer.prompt([
          {
            name: 'allowAccountAddressCreation',
            message: `Can we fund a new 'JUP-XXX' account with a tiny amount of $JUP to use to execute transactions to store your account information on the blockchain?`,
            type: 'confirm',
            default: currentConfig.allowAccountAddressCreation,
          },
        ])
        if (allowAccountAddressCreation) {
          const {
            jupiterClient,
            address,
            publicKey,
            account,
            newSecretPhrase,
          } = await getNewJupiterAddress(updatedConfig)
          await jupiterClient.sendMoney(address)

          updatedConfig = {
            ...updatedConfig,
            fndrAddress: address,
            fndrSecretPhrase: newSecretPhrase,
            fndrPublicKey: publicKey,
            fndrAccount: account,
          }
        }
      }

      return JSON.stringify({ ...currentConfig, ...updatedConfig }, null, 2)
    },

    async isConfigValid(config: string) {
      const currentConfig = JSON.parse(config)
      return (
        currentConfig.fndrAddress &&
        currentConfig.fndrSecretPhrase &&
        currentConfig.fndrPublicKey &&
        currentConfig.fndrAccount
      )
    },

    async getAllAccounts(config: string) {
      const client = getFndrJupiterClient(config)
      const txns = await client.getAllTransactions()

      const allRecords: IFndrAccountMap = (
        await Promise.all(
          txns.map(async (txn) => {
            try {
              assert(client.recordKey, 'recordKey not set appropriately')
              const decryptedMessage = await client.decryptRecord(
                txn.attachment.encryptedMessage
              )
              let account = JSON.parse(await client.decrypt(decryptedMessage))
              if (!account[client.recordKey]) return false

              delete account[client.recordKey]
              return { ...account, meta: txn.transaction }
            } catch (err) {
              return false
            }
          })
        )
      )
        .filter((r) => !!r)
        .reduce(
          (obj: IFndrAccountMap, acc: IFndrAccount) => ({
            ...obj,
            [acc.id]: { ...obj[acc.id], ...acc },
          }),
          {}
        )

      return Object.values(allRecords).filter((r) => !r.isDeleted)
    },

    async getAccount(
      config: string,
      opts: IGetAccountOpts,
      accountListOverride?: IFndrAccount[]
    ) {
      const { id, name } = opts
      const accounts =
        accountListOverride || (await this.getAllAccounts(config))
      let account: undefined | IFndrAccount
      if (id) {
        account = accounts.find((a) => a.id === id)
      } else {
        account = accounts.find((a) => a.name === name)
      }

      assert(
        account,
        `We didn't find an account matching the provided parameters.`
      )
      return account
    },

    async addAccount(config: string, account: IFndrAccount) {
      await getFndrJupiterClient(config).storeRecord(account)
    },

    async updateAccount(config: string, account: IFndrAccount) {
      await Promise.all([
        this.deleteAccount(config, account.id),
        this.addAccount(config, { ...account, id: uuidv1() }),
      ])
    },

    async deleteAccount(config: string, id: string) {
      const accounts = await this.getAllAccounts(config)
      const account = accounts.find((a) => a.id === id)
      assert(account, `We didn't find an account matching the ID provided.`)
      await getFndrJupiterClient(config).storeRecord({ id, isDeleted: true })
    },
  }
}

export async function getNewJupiterAddress(config: IStringMap): Promise<any> {
  const jupiterClient = getUserMainJupiterClient(JSON.stringify(config))
  const newSecretPhrase = generatePassphrase()
  const info = await jupiterClient.createNewAddress(newSecretPhrase)
  return { ...info, jupiterClient, newSecretPhrase }
}

function getUserMainJupiterClient(config: string) {
  const currentConfig = JSON.parse(config)
  return JupiterClient({
    recordKey: '__jupiter-password-manager',
    server: currentConfig.jupiterServer,
    address: currentConfig.fundedAddress,
    passphrase: currentConfig.fundedAddressPassphrase,
    encryptSecret: currentConfig.encryptSecret,
  })
}

function getFndrJupiterClient(config: string) {
  const currentConfig = JSON.parse(config)
  return JupiterClient({
    recordKey: '__jupiter-password-manager',
    server: currentConfig.jupiterServer,
    address: currentConfig.fndrAddress,
    publicKey: currentConfig.fndrPublicKey,
    passphrase: currentConfig.fndrSecretPhrase,
    encryptSecret: currentConfig.encryptSecret,
  })
}

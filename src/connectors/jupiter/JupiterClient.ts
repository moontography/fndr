import axios, { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'
import Encryption from '../../libs/Encryption'

export default function JupiterClient(opts: IJupiterClientOpts) {
  const encryption = Encryption({ secret: opts.encryptSecret })
  const CONF = {
    feeNQT: opts.feeNQT || 500,
    deadline: opts.deadline || 60,
    minimumTableBalance: opts.minimumTableBalance || 50000,
    minimumAppBalance: opts.minimumAppBalance || 100000,
    moneyDecimals: opts.moneyDecimals || 8,
  }

  // balances from the API come back as NQT, which is 1e-8 JUP
  const nqtToJup = (nqt: string): string =>
    new BigNumber(nqt).div(CONF.moneyDecimals).toString()

  return {
    client: axios.create({
      baseURL: opts.server,
      headers: {
        'User-Agent': 'jupiter-password-manager',
      },
    }),

    async loadDatabase() {
      const transactions = await this.getAllTransactions()
    },

    async getBalance(address: string = opts.address): Promise<string> {
      const {
        data: {
          // unconfirmedBalanceNQT,
          // forgedBalanceNQT,
          balanceNQT,
          // requestProcessingTime
        },
      } = await this.request('get', '/nxt', {
        params: {
          requestType: 'getBalance',
          account: address,
        },
      })
      return nqtToJup(balanceNQT)
    },

    async createNewAddress(passphrase: string) {
      const {
        data: { accountRS: address, publicKey, requestProcessingTime, account },
      } = await this.request('post', '/nxt', {
        params: {
          requestType: 'getAccountId',
          secretPhrase: passphrase,
        },
      })
      return { address, publicKey, requestProcessingTime, account }
    },

    async parseEncryptedRecord(cipherText: string): Promise<IStringMap> {
      return JSON.parse(await encryption.decrypt(cipherText))
    },

    async storeRecord(record: IStringMap) {
      const { data } = await this.request('post', '/nxt', {
        params: {
          requestType: 'sendMessage',
          secretPhrase: opts.passphrase,
          recipient: opts.address,
          messageToEncrypt: encryption.encrypt(
            JSON.stringify({
              ...record,
              [`__jupiter-password-manager`]: true,
            })
          ),
          feeNQT: CONF.feeNQT,
          deadline: CONF.deadline,
          recipientPublicKey: opts.publicKey,
          compressMessageToEncrypt: true,
        },
      })
      return data
    },

    async getAllTransactions(
      withMessage: boolean = true,
      type: number = 1
    ): Promise<ITransaction[]> {
      const {
        data: {
          /* requestProcessingTime, */
          transactions,
        },
      } = await this.request('get', '/nxt', {
        params: {
          requestType: 'getBlockchainTransactions',
          account: opts.address,
          withMessage,
          type,
        },
      })
      return transactions
    },

    async request(
      verb: 'get' | 'post',
      path: string,
      opts?: IRequestOpts
    ): Promise<AxiosResponse> {
      switch (verb) {
        case 'post':
          return await this.client.post(
            path,
            undefined, // opts && opts.body
            {
              params: opts && opts.params,
            }
          )

        default:
          // get
          return await this.client.get(path, opts)
      }
    },
  }
}

interface IJupiterClientOpts {
  server: string
  address: string
  passphrase: string
  publicKey: string
  encryptSecret: string
  appId: string
  appName?: string
  feeNQT?: number
  deadline?: number
  minimumTableBalance?: number
  minimumAppBalance?: number
  moneyDecimals?: number
}

interface IRequestOpts {
  // TODO: according to the NXT docs the only way to pass parameters is
  // via query string params, even if it's a POST. This seems bad, but for
  // now since POST body isn't support don't allow it in a request.
  params?: any
  // body?: any
}

interface ITransactionAttachment {
  'version.OrdinaryPayment': number
}

interface ITransaction {
  signature: string
  transactionIndex: number
  type: number
  phased: boolean
  ecBlockId: string
  signatureHash: string
  attachment: ITransactionAttachment
  senderRS: string
  subtype: number
  amountNQT: string
  recipientRS: string
  block: string
  blockTimestamp: number
  deadline: number
  timestamp: number
  height: number
  senderPublicKey: string
  feeNQT: string
  confirmations: number
  fullHash: string
  version: number
  sender: string
  recipient: string
  ecBlockHeight: number
  transaction: string
}

interface IStringMap {
  [key: string]: any
}

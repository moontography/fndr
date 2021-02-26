import assert from 'assert'
import JupiterClient from './JupiterClient'

describe('JupiterClient', function() {
  this.timeout(20000)

  const myAddy = 'JUP-TUWZ-4B8Z-9REP-2YVH5'
  const client = JupiterClient({
    server: 'https://jpr.gojupiter.tech',
    address: myAddy,
    passphrase: '',
    encryptSecret: '',
  })

  describe('#createNewAddress()', function() {
    it(`should create a new address`, async () => {
      const { address, publicKey } = await client.createNewAddress('the seed')
      assert.strictEqual(typeof address, 'string')
      assert.strictEqual(typeof publicKey, 'string')
    })
  })

  describe('#getAllTransactions()', function() {
    it(`should get all transactions of type 0`, async () => {
      const txns = await client.getAllTransactions(false, 0)
      assert.strictEqual(txns.length > 0, true)
      assert.strictEqual(txns.reverse()[0].recipientRS, myAddy)
    })
  })
})

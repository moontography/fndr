import assert from 'assert'
import { generateKeywords, generatePassphrase } from '.'
import WordList from './WordList'

const wordList = WordList()

describe('utils', function() {
  describe('#generateKeywords', function() {
    it(`should encrypt string without issue`, async () => {
      const words = generateKeywords()
      const hasValidWords = words
        .split(' ')
        .reduce((isValid: boolean, word: string) => {
          return isValid && wordList.includes(word)
        }, true)

      assert.strictEqual(words.split(' ').length, 4)
      assert.strictEqual(hasValidWords, true)
    })
  })

  describe('#generatePassphrase', function() {
    it(`should encrypt string without issue`, async () => {
      const words = generatePassphrase()
      const hasValidWords = words
        .split(' ')
        .reduce((isValid: boolean, word: string) => {
          return isValid && wordList.includes(word)
        }, true)

      assert.strictEqual(words.split(' ').length, 12)
      assert.strictEqual(hasValidWords, true)
    })
  })
})

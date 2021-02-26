import WordList from './WordList'

// The following is the code which will generate a list of 12
// random words that will be used to generate an nxt account
export function generatePassphrase(): string {
  return getWords(12).join(' ')
}

// The following is the code which will generate a list of 4
// random words that will be used to generate an api key
export function generateKeywords(): string {
  return getWords(4).join(' ')
}

function getWords(numWords: number): string[] {
  const list = WordList()
  const seedphrase: string[] = new Array(numWords).fill('').reduce((words) => {
    const word = list.splice(Math.floor(Math.random() * list.length), 1)
    return words.concat([word])
  }, [])
  return seedphrase
}

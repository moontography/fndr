import Vomit from '../libs/Vomit'

export default function SearchCommand(connector: IFndrConnector): IFndrCommand {
  return {
    name: 'search',

    help() {
      return `Search for accounts in your fndr database.`
    },

    options() {
      return [
        {
          flag: '-q, --query <query>',
          desc: 'the text to search for in your account record(s)',
        },
      ]
    },

    async run(currentConfig: string, options: any) {
      const { query } = options
      const matches = await connector.getAllAccounts(currentConfig)
      const nameMatches = searchForAccountsByField(matches, 'name', query)
      const usernameMatches = searchForAccountsByField(
        matches,
        'username',
        query
      )
      Vomit.listAccounts(
        nameMatches
          .concat(usernameMatches)
          .sort(sortByName)
          .reduce((acc: IFndrAccount[], val: IFndrAccount) => {
            if (acc.indexOf(val) === -1) acc.push(val)
            return acc
          }, []),
        matches.length
      )
    },
  }
}

function sortByName(acc1: IFndrAccount, acc2: IFndrAccount) {
  return acc1.name.toLowerCase() < acc2.name.toLowerCase() ? -1 : 1
}

function searchForAccountsByField(
  accounts: IFndrAccount[],
  field: 'name' | 'username' | 'password' | 'extra',
  searchString?: string
): IFndrAccount[] {
  return accounts
    .map((account) => {
      if (searchString) {
        const searchRegexp = new RegExp(searchString, 'i')
        const fieldMatches =
          account[field] && searchRegexp.test(account[field] as string)
        if (fieldMatches) return account
        return null
      }
      return account
    })
    .filter((info) => !!info) as any
}

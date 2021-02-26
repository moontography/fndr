interface IFndrConnector {
  config(current: string): Promise<string>
  searchAccounts(query: string): Promise<IFndrAccount[]>
  getAccount(opts: IGetAccountOpts): Promise<IFndrAccount>
  addAccount(acc: IFndrAccount): Promise<void>
  updateAccount(acc: IFndrAccount): Promise<void>
  deleteAccount(id: string): Promise<void>
}

interface IFndrAccount {
  id?: string
  name: string
  username?: string
  password?: string
  extra?: string
}

interface IGetAccountOpts {
  id?: string
  name?: string
}

interface IFndrCommand {
  help(): string
  run(...args: any): Promise<void>
}

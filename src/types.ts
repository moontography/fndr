interface IFndrConnector {
  config(config: string): Promise<string>
  isConfigValid?(config: string): Promise<boolean>
  getAllAccounts(config: string, query?: string): Promise<IFndrAccount[]>
  getAccount(config: string, opts: IGetAccountOpts): Promise<IFndrAccount>
  addAccount(config: string, acc: IFndrAccount): Promise<void>
  updateAccount(config: string, acc: IFndrAccount): Promise<void>
  deleteAccount(config: string, id: string): Promise<void>
}

interface IFndrAccount {
  id: string
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
  name: string
  help(): string
  run(config: any, options?: any): Promise<void>
  options?(): IFndrCommandOptions[]
}

interface IFndrCommandOptions {
  flag: string
  desc: string
  isRequired?: boolean
}

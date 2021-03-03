interface IStringMap {
  [key: string]: any
}

interface IFndrConnector {
  name: string
  config(config: string): Promise<string>
  isConfigValid?(config: string): Promise<boolean>
  getAllAccounts(config: string, query?: string): Promise<IFndrAccount[]>
  getAccount(
    config: string,
    opts: IGetAccountOpts,
    extra?: any
  ): Promise<IFndrAccount>
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
  isDeleted?: boolean
  meta?: string
}

interface IFndrAccountMap {
  [id: string]: IFndrAccount
}

interface IGetAccountOpts {
  id?: string
  name?: string
}

interface IFndrCommand {
  name: string
  help(): string
  execute(config: string, options?: any): any
  runCli(config: string, options?: any): Promise<void>
  options?(): IFndrCommandOptions[]
}

interface IFndrCommandOptions {
  flag: string
  desc: string
  isRequired?: boolean
}

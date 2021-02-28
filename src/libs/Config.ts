import assert from 'assert'
import path from 'path'
import dayjs from 'dayjs'
import inquirer from 'inquirer'
import FileManagement from './FileManagement'
import { IConnectors } from '../connectors'

const fileMgmt = FileManagement()

export default function Config(connectorName?: string) {
  const homeDir =
    process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']
  assert(homeDir, 'home directory was not found to store fndr configuration.')

  const confDir = path.join(homeDir, '.fndr')
  const confFile = path.join(confDir, `${connectorName || 'fndr'}.json`)
  const connectorFile = path.join(confDir, `connector`)

  return {
    confDir,
    confFile,
    connectorFile,

    async checkAndPromptToCreateConfigFile(): Promise<undefined | string> {
      const doesDirExist = await fileMgmt.doesDirectoryExist(confDir)
      const doesFileExist = await fileMgmt.doesFileExist(confFile)
      if (!(doesDirExist && doesFileExist)) {
        const response = await inquirer.prompt([
          {
            name: 'allowedToCreateConfig',
            message: `May we create & use a configuration file at the following location: ${confFile}?`,
            type: 'confirm',
            default: true,
          },
        ])

        if (!response.allowedToCreateConfig) return

        await fileMgmt.checkAndCreateDirectoryOrFile(confDir)
        const firstTimeInstallConfigFileContents = ``

        let initialContents = JSON.stringify({}, null, 2)
        if (!!firstTimeInstallConfigFileContents)
          initialContents = JSON.stringify(
            firstTimeInstallConfigFileContents,
            null,
            2
          )

        await fileMgmt.checkAndCreateDirectoryOrFile(
          confFile,
          true,
          initialContents
        )
        return initialContents
      }
      const confStr = await fileMgmt.getLocalFile(confFile, 'utf8')
      assert(
        typeof confStr === 'string',
        'configuration was not returned as string'
      )
      return confStr
    },

    async changeConnector(newConnector: string) {
      await fileMgmt.checkAndCreateDirectoryOrFile(confDir)
      await fileMgmt.writeFile(this.connectorFile, newConnector)
    },

    async getConnector(): Promise<IConnectors> {
      const connFileExists = await fileMgmt.doesFileExist(this.connectorFile)
      const conn = !connFileExists
        ? 'filesystem'
        : await fileMgmt.getLocalFile(this.connectorFile, 'utf8')
      assert(typeof conn === 'string', `connector wasn't returned as a string`)
      return conn as IConnectors
    },

    async exportAccounts(accounts: IFndrAccount[]) {
      await fileMgmt.checkAndCreateDirectoryOrFile(confDir)
      const exportFile = path.join(confDir, `export_${dayjs().unix()}.json`)
      await fileMgmt.writeFile(exportFile, JSON.stringify(accounts, null, 2))
      return exportFile
    },
  }
}

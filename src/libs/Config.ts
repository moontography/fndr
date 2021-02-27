import assert from 'assert'
import path from 'path'
import inquirer from 'inquirer'
import FileManagement from './FileManagement'

const fileMgmt = FileManagement()

export default function Config(connectorName: string) {
  const homeDir =
    process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']
  assert(homeDir, 'home directory was not found to store fndr configuration.')

  const confDir = path.join(homeDir, '.fndr')
  const confFile = path.join(confDir, `${connectorName}.json`)

  return {
    confDir,
    confFile,

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
  }
}

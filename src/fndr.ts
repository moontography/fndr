import assert from 'assert'
import { program } from 'commander'
import Config from './libs/Config'
import Vomit from './libs/Vomit'
import Commands from './commands'
import Connectors from './connectors'
;(async function fndr() {
  try {
    program.version(require('../package.json').version, '-v, --version')
    const connectorName = await Config().getConnector()

    Commands.forEach((comm) => {
      const connector = Connectors[connectorName || 'filesystem']
      const commandFactory = comm(connector)
      const cmdrCommandInst = program.command(commandFactory.name)

      cmdrCommandInst.description(commandFactory.help())

      const options = (commandFactory.options && commandFactory.options()) || []
      options.forEach((opt) => {
        let method: 'option' | 'requiredOption' = 'option'
        if (opt.isRequired) method = 'requiredOption'
        cmdrCommandInst[method](opt.flag, opt.desc)
      })

      cmdrCommandInst.action(async (options) => {
        try {
          const currentConfig = await Config(
            connectorName
          ).checkAndPromptToCreateConfigFile()
          if (typeof currentConfig === 'undefined') {
            throw new Error(`There was a problem with your configuration file.`)
          }
          const confIsValid =
            !connector.isConfigValid ||
            (await connector.isConfigValid(currentConfig))
          if (!confIsValid) {
            if (commandFactory.name !== 'config') {
              const configCommandFact = Commands.find(
                (c) => c(connector).name === 'config'
              )
              assert(configCommandFact, 'config command factory not found')

              await configCommandFact(connector).runCli(currentConfig, options)
            }
          }
          await commandFactory.runCli(currentConfig, options)
        } catch (err) {
          let error = err
          if (err instanceof Error)
            error = `${err.name} - ${err.message} - ${err.stack}`
          Vomit.error(error)
        }
      })
    })

    program.on('command:*', function invalidCommand() {
      console.error(
        'Invalid command: %s\nSee --help for a list of available commands.',
        program.args.join(' ')
      )
    })

    program.parse(process.argv)

    if (program.args.length === 0) {
      console.error(
        'Please provide a valid command\nSee --help for a list of available commands.'
      )
    }
  } catch (err) {
    console.error(err)
    process.exit()
  }
})()

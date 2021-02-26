import program from 'commander'
import Commands from './commands'
import Connectors from './connectors'
;(async function jpm() {
  try {
    program.version(require('../package.json').version, '-v, --version')

    Object.keys(Commands).forEach((comm) => {
      // TODO: don't hard code connector
      const commandFactory = (Commands as any)[comm](Connectors.jupiter)
      program
        .command(comm)
        .description(commandFactory.help())
        .action((...args) => {
          commandFactory.run(...args)
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

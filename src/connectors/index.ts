import FileSystem from './filesystem'
import Jupiter, { getNewJupiterAddress } from './jupiter'

export default {
  filesystem: FileSystem,
  jupiter: Jupiter,
}

export { getNewJupiterAddress }

export type IConnectors = 'filesystem' | 'jupiter'

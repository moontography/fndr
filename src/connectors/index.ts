import FileSystem from './filesystem'
import Jupiter from './jupiter'

export default {
  filesystem: FileSystem,
  jupiter: Jupiter,
}

export type IConnectors = 'filesystem' | 'jupiter'

import path from 'path'
import fs from 'fs'

const fsStatPromise = fs.promises.stat
const fsWriteFile = fs.promises.writeFile
const mkdirPromise = fs.promises.mkdir
const readFilePromise = fs.promises.readFile
const readdirPromise = fs.promises.readdir

export default function FileManagement() {
  return {
    getLocalFileStream(filePath: string) {
      return fs.createReadStream(filePath)
    },

    async getLocalFile(filePath: string, encoding?: BufferEncoding) {
      return await readFilePromise(filePath, { encoding })
    },

    async readDir(dirPath: string) {
      return await readdirPromise(dirPath)
    },

    async writeFile(filePath: string, contents: any) {
      await fsWriteFile(filePath, contents)
    },

    async checkAndCreateDirectoryOrFile(
      filepath: string,
      isFile: boolean = false,
      fileContents: any = JSON.stringify([])
    ): Promise<boolean> {
      try {
        if (isFile && !(await this.doesFileExist(filepath))) {
          // Since all files should hold JSON that will be large arrays,
          // initialize the file with an empty array
          await fsWriteFile(filepath, fileContents)
        } else if (!(await this.doesDirectoryExist(filepath))) {
          await mkdirPromise(filepath)
        }

        return true
      } catch (err) {
        if (err.code == 'EEXIST') return true

        throw err
      }
    },

    async doesDirectoryExist(filePath: string): Promise<boolean> {
      return await this.doesDirOrFileExist(filePath, 'isDirectory')
    },

    async doesFileExist(filePath: string): Promise<boolean> {
      return await this.doesDirOrFileExist(filePath, 'isFile')
    },

    async doesDirOrFileExist(
      filePath: string,
      method: 'isDirectory' | 'isFile'
    ): Promise<boolean> {
      try {
        const stats: fs.Stats = await fsStatPromise(filePath)
        return stats[method]()
      } catch (e) {
        return false
      }
    },

    getFileName(
      fileName: string,
      extraText: number | string = Date.now()
    ): string {
      fileName = encodeURIComponent(fileName)
      return `${fileName
        .split('.')
        .slice(0, -1)
        .join('.')}_${extraText}${path.extname(fileName)}`
    },
  }
}

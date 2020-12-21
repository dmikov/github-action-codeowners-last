import * as fs from 'fs'
import path from 'path'

export class Codeowners {
  private entries: Map<string, string[]> = new Map()
  private readonly filePath: string
  private isDirty = false

  constructor(private monitorDirectory: string, private numberOfAuthors: number) {
    this.filePath = path.join(monitorDirectory, 'CODEOWNERS')
    this.load(this.filePath)
  }

  private load(filePath: string): void {
    const content: string = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'as+'})
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue
      const [commitFilePath, ...owners] = line.split(' ')
      this.entries.set(commitFilePath, owners)
    }
  }

  private *lines(): Generator<string, void> {
    for (const entry of this.entries.entries()) {
      yield [entry[0], ...entry[1]].join(' ')
    }
  }

  dump(): string | undefined {
    if (this.isDirty) {
      const writeStream = fs.createWriteStream(this.filePath, {encoding: 'utf8', flags: 'w'})
      for (const line of this.lines()) {
        writeStream.write(`${line}\n`)
      }
      writeStream.end()
      return this.filePath
    }
  }

  add(file: string, user: string): void {
    if (this.skip(file)) return
    this.isDirty = true
    const userText = `@${user}`
    if (!this.entries.has(file)) {
      this.entries.set(file, [userText])
    } else {
      const existingCodeowners: string[] = this.entries.get(file) ?? []
      if (existingCodeowners.length >= this.numberOfAuthors) existingCodeowners.shift()
      const sameAuthor = existingCodeowners.indexOf(userText)
      if (sameAuthor >= 0) existingCodeowners.splice(sameAuthor, 1)
      existingCodeowners.push(userText)
    }
  }

  private skip(file: string): boolean {
    if (file.includes('CODEOWNERS')) return true
    return !!this.monitorDirectory && !file.startsWith(this.monitorDirectory)
  }

  remove(file: string): void {
    this.entries.delete(file)
  }
}

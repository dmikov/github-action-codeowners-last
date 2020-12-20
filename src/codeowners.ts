import * as fs from 'fs'

export class Codeowners {
  entries: Map<string, string[]> = new Map()

  constructor(private filePath: string, private numberOfAuthors: number) {
    this.load(filePath)
  }

  private load(filePath: string) {
    const content: string = fs.readFileSync(filePath, {encoding:'utf8', flag: 'as+'} )
    for (const line of content.split(/\r?\n/)) {
      if(!line || line.startsWith('#')) continue
      const [path, ...owners] = line.split(' ')
      this.entries.set(path, owners)
    }
  }

  private *lines() {
    for (const entry of this.entries.entries()) {
      yield [entry[0], ...entry[1]].join(' ');
    }
  }

  dump() {
    let writeStream = fs.createWriteStream(this.filePath, {encoding:'utf8', flags: 'w'});
    for(const line of this.lines()) {
      writeStream.write(line + '\n');
    }
    writeStream.end();
  }

  add(file: string, user: string) {
    const userText = `@${user}`
    if(!this.entries.has(file)) {
      this.entries.set(file, [userText])
    }
    else {
      let existingCodeowners: string[] = this.entries.get(file) ?? []
      if(existingCodeowners.length >= this.numberOfAuthors) existingCodeowners.shift()
      const sameAuthor = existingCodeowners.indexOf(userText)
      if(sameAuthor >= 0) existingCodeowners.splice(sameAuthor, 1)
      existingCodeowners.push(userText)
    }
  }

  remove(file: string) {
    this.entries.delete(file)
  }
}

let codeowners = new Codeowners('c:\\temp\\CODEOWNERS', 3)
console.log(codeowners.entries)

codeowners.add('/projects/dotnet/Core/applications.json', 'dmikov')
codeowners.add('/projects/dotnet/Core/applications.json', 'vterziski')
codeowners.add('/projects/dotnet/Core/applications.json', 'brant')
codeowners.add('/projects/dotnet/Core/applications.json', 'vterziski')
console.log(codeowners.entries)
codeowners.dump()
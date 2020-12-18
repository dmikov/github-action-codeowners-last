import * as core from '@actions/core'
import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'

const req = {required: true}

function change(value: string): void {
  core.debug(value)
}

function remove(value: string): void {
  core.debug(value)
}

function getBaseHead(context: Context): [string, string] {
  let base: string
  let head: string
  switch (context.eventName) {
    case 'pull_request':
      base = context.payload.pull_request?.base.sha
      head = context.payload.pull_request?.head.sha
      break
    case 'push':
      base = context.payload.before
      head = context.payload.after
      break
    default:
      throw Error(`This action supports pull requests and pushes, not ${context.eventName}.`)
  }
  if (!base || !head) {
    throw Error(`The base or head commits are missing in ${context.eventName} event.`)
  }
  core.debug(`Base: ${base}`)
  core.debug(`Head: ${head}`)
  return [base, head]
}

async function run(): Promise<void> {
  try {
    const client = github.getOctokit(core.getInput('token', req))
    const context = github.context

    const payload = JSON.stringify(github.context.payload, undefined, 2)
    core.debug(`The event payload: ${payload}`)
    const [base, head] = getBaseHead(context)
    const response = await client.repos.compareCommits({
      base,
      head,
      owner: context.repo.owner,
      repo: context.repo.repo
    })
    core.debug(`Response: ${JSON.stringify(response, undefined, 2)}`)

    if (response.status !== 200) {
      throw Error(`The Octokit client returned ${response.status}.`)
    }

    for (const file of response.data.files) {
      core.debug(`File: ${JSON.stringify(file, undefined, 2)}`)

      const filename = file.filename
      switch (file.status) {
        case 'added':
        case 'modified':
        case 'renamed':
          change(filename)
          break
        case 'removed':
          remove(filename)
          break
        default:
          throw Error(`One of the files has unsupported file status '${file.status}'.`)
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

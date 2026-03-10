import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import {Test, runAll} from './runner'

const run = async (): Promise<void> => {
  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    const jsonPath = core.getInput('autograding-json-path') || '.github/classroom/autograding.json'
    const data = fs.readFileSync(path.resolve(cwd, jsonPath))
    const json = JSON.parse(data.toString())

    await runAll(json.tests as Array<Test>, cwd)
  } catch (error) {
    // If there is any error we'll fail the action with the error message
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`An unknown error occurred`)
    }
    core.setFailed(`Autograding failure: ${error}`)
  }
}

// Don't auto-execute in the test environment
if (process.env['NODE_ENV'] !== 'test') {
  run()
}

export default run

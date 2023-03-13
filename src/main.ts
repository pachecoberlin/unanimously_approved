import * as core from '@actions/core'
import * as github from '@actions/github'
import {approved} from './approved'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const statusContext: string = core.getInput('status-context')
    const statusDescription: string = core.getInput('status-description')

    core.debug(JSON.stringify(github.context))

    const octokit = github.getOctokit(token)
    await octokit.rest.repos.createCommitStatus({
      ...github.context.repo,
      sha: github.context.payload.pull_request?.head.sha,
      state: (await approved(token)) ? 'success' : 'failure',
      context: statusContext,
      description: statusDescription,
      target_url: `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()


/*import * as core from '@actions/core'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
*/

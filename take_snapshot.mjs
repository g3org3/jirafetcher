#!/usr/bin/env node
// @ts-check
import * as jira from './jira_client.mjs'
import env from './env.mjs'
import { writeToCache } from './files.mjs'

async function main() {
  const sprints = await jira.getSprints(env.JIRA_BOARD_ID)
  const sprint = sprints.find((sprint) => sprint.state === 'active')
  // const sprint = sprints.find(sprint => sprint.name === 'Sprint 107')
  if (!sprint) return

  const issues = await jira.getIssues(env.JIRA_BOARD_ID, sprint.id)
  await writeToCache('issues', sprint.name, issues)
}

await main()

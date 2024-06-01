// @ts-check
import { writeFile } from 'fs/promises'
import Path from 'path'
import { DateTime } from 'luxon'
import pino from 'pino'
import pretty from 'pino-pretty'

const logger = pino(pretty())

/**
 * @param {string} entity
 * @param {string} sprint
 * @param {Array<import('./jira_schemas.mjs').Issue>} data
 **/
export async function writeToCache(entity, sprint, data) {
  const date = DateTime.now().toISODate()
  const filepath = Path.resolve(`./data/${entity}_${sprint.replace(' ', '_')}_${date}.json`)
  await writeFile(filepath, JSON.stringify(data, null, 2))
  logger.info(`created snapshot at ${filepath}`)

  const delimiter = '|'
  const filecsvpath = Path.resolve(`./data/${entity}_${sprint.replace(' ', '_')}_${date}.csv`)
  const csvrows = data.map((item) => ({
    key: item.key,
    summary: item.fields.summary,
    description: item.fields.description,
    points: item.fields.customfield_10006,
    epic: item.fields.epic?.name,
    labels: item.fields.labels.join(','),
    sprint: item.fields.sprint?.name,
    status: item.fields.status.name,
    parents: item.fields.issuelinks
      .filter((il) => il.type.name === 'Blocks' && il.inwardIssue)
      .map((il) => il.inwardIssue?.key)
      .join(','),
  }))

  const headers = Object.keys(csvrows[0]).join(delimiter)
  const rows = csvrows
    .map((x) =>
      Object.values(x)
        .map((x) => `"${String(x || '').replace(/"/g, '""')}"`)
        .join(delimiter)
    )
    .join('\n')
  const csv = `${headers}\n${rows}`
  await writeFile(filecsvpath, csv)
  logger.info(`created snapshot at ${filecsvpath}`)
}

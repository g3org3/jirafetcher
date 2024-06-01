// @ts-check
import { z } from 'zod'
import { request } from './request.mjs'
import { getResponseSchema, boardSchema, epicSchema, sprintSchema, issueSchema } from './jira_schemas.mjs'

/**
 * @template T
 * @param {string} url
 * @param {import('./jira_schemas.mjs').GenericSchema<T>} schema
 * @returns {Promise<Array<T>>}
 **/
async function getObjects(url, schema) {
  let data = await request(url, null)
  // const {values, ...rest} = data
  // console.log('--')
  // console.log(data)
  // console.log(Object.keys(data), data.values[0])
  // if (url.includes('issue'))
  // console.log(Object.keys(data), data.issues[1])
  // let res = schema.parse({...rest, values })
  // process.exit()

  let res = null
  try {
    res = schema.parse(data)
  } catch (err) {
    if (err instanceof z.ZodError) {
      // @ts-ignore
      const { code, path, expected, received } = err.issues[0]
      console.log(code, path.join('.'), `${expected} != ${received}`)
      process.exit()
    }
  }

  if (!res) process.exit(1)

  let items = []
  if (res.values) {
    items = res.values
  }
  if (res.issues) {
    items = res.issues
  }
  let startAt = 50
  let isLast = res.isLast
  if (res.isLast == undefined) {
    if (!res.total) throw new Error(`total is not defined ${res.total}`)
    isLast = items.length >= res.total
  }

  while (!isLast) {
    data = await request(url, { startAt: String(startAt) })
    try {
      res = schema.parse(data)
      if (res.values) {
        items = items.concat(res.values)
      }
      if (res.issues) {
        items = items.concat(res.issues)
      }
      startAt += 50
      if (res.isLast == undefined) {
        if (!res.total) throw new Error(`total is not defined ${res.total}`)
        isLast = items.length >= res.total
      } else {
        isLast = res.isLast
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // @ts-ignore
        const { code, path, expected, received } = err.issues[0]
        console.log(code, path.join('.'), `${expected} != ${received}`)
        process.exit()
      }
    }
  }

  return items
}

export async function getBoards() {
  const url = 'rest/agile/1.0/board'
  const schema = getResponseSchema(boardSchema)
  return await getObjects(url, schema)
}

/**
 * @param {string} boardId
 */
export async function getEpics(boardId) {
  const url = `rest/agile/1.0/board/${boardId}/epic`
  const schema = getResponseSchema(epicSchema)
  return await getObjects(url, schema)
}

/**
 * @param {string} boardId
 */
export async function getSprints(boardId) {
  const url = `rest/agile/1.0/board/${boardId}/sprint`
  const schema = getResponseSchema(sprintSchema)
  return await getObjects(url, schema)
}

/**
 * @param {string} boardId
 * @param {number} sprintId
 **/
export async function getIssues(boardId, sprintId) {
  const url = `rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue`
  const schema = getResponseSchema(issueSchema)
  return await getObjects(url, schema)
}

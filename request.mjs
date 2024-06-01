// @ts-check
import fetch from 'node-fetch'
import pino from 'pino'
import pretty from 'pino-pretty'

import env from './env.mjs'

const logger = pino(pretty())
const headers = {
  cookie: `${env.JIRA_COOKIE_NAME}=${env.JIRA_COOKIE_VALUE};`,
}

// IGNORE TLS CHECK BECAUSE IS SELF SIGNED
process.env['NODE_NO_WARNINGS'] = '1'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

/**
 * @param {string} endpoint
 * @param {Record<string, string> | null} queryString
 **/
export async function request(endpoint, queryString) {
  const qs = queryString ? '?' + new URLSearchParams(queryString).toString() : ''
  const res = await fetch(`${env.JIRA_HOST}/${endpoint}${qs}`, { headers })
  if (res.status >= 400) {
    const err = `Request failed with status: ${res.status} (${res.statusText})`
    logger.error(err)
    throw new Error(err)
  }

  logger.info(`${res.status} /${endpoint}${qs}`)
  return res.json()
}

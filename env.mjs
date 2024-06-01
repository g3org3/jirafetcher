// @ts-check
import { z } from 'zod'

const envSchema = z.object({
  JIRA_HOST: z.string(),
  JIRA_COOKIE_NAME: z.string(),
  JIRA_COOKIE_VALUE: z.string(),
  JIRA_BOARD_ID: z.string(),
})

const config = {
  JIRA_HOST: process.env.JIRA_HOST,
  JIRA_COOKIE_NAME: process.env.JIRA_COOKIE_NAME,
  JIRA_COOKIE_VALUE: process.env.JIRA_COOKIE_VALUE,
  JIRA_BOARD_ID: process.env.JIRA_BOARD_ID,
}

export default envSchema.parse(config)

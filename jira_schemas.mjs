// @ts-check
import { z } from 'zod'

export const boardSchema = z.object({
  id: z.number(),
  self: z.string(),
  name: z.string(),
  type: z.string(),
})

export const epicSchema = z.object({
  id: z.number(),
  key: z.string(),
  self: z.string(),
  name: z.string(),
  summary: z.string(),
  color: z.object({
    key: z.string(),
  }),
  done: z.boolean(),
})

export const sprintSchema = z.object({
  id: z.number(),
  activatedDate: z.string().nullish(),
  autoStartStop: z.boolean(),
  completeDate: z.string().nullish(),
  endDate: z.string().nullish(),
  goal: z.string().nullish(),
  name: z.string(),
  originBoardId: z.number(),
  self: z.string(),
  startDate: z.string().nullish(),
  state: z.string(),
  synced: z.boolean(),
})

export const userSchema = z.object({
  name: z.string(),
  emailAddress: z.string(),
  displayName: z.string(),
})

export const issueSchema = z.object({
  key: z.string(),
  self: z.string(),
  fields: z.object({
    summary: z.string(),
    sprint: sprintSchema.nullish(),
    labels: z.string().array(),
    issuelinks: z
      .object({
        type: z.object({
          name: z.string(),
        }),
        inwardIssue: z
          .object({
            key: z.string(),
          })
          .nullish(),
      })
      .array(),
    customfield_10006: z.number().nullish(),
    reporter: userSchema.nullable(),
    assignee: userSchema.nullable(),
    epic: epicSchema.nullish(),
    description: z.string().nullable(),
    status: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
})
/** @typedef{z.infer<issueSchema>} Issue */

/**
 * @template T
 * @param {z.ZodType<T>} schema
 **/
export const getResponseSchema = (schema) =>
  z.object({
    maxResults: z.number(),
    startAt: z.number(),
    total: z.number().nullish(),
    isLast: z.boolean().nullish(), // undefined for getting issues
    values: schema.array().nullish(),
    issues: schema.array().nullish(),
  })

/**
 * @typedef{ReturnType<typeof getResponseSchema<T>>} GenericSchema<T>
 * @template T
 **/

import { z } from 'zod';


export const addMessageSchema = z.object({
  message: z.string().max(200),
  hasImage: z.boolean().optional(),
})

export const fetchMessagesSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish()
})

export const deleteMessageSchema = z.object({
  messageId: z.string(),
})
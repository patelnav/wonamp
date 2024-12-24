import { z } from 'zod'

export const songSchema = z.object({
  id: z.string(),
  artist: z.string(),
  songTitle: z.string(),
  youtubeLink: z.string().nullable(),
  youtubeTitle: z.string().optional(),
  duration: z.string().optional()
})

export const songArraySchema = z.array(songSchema)

export type SongSchema = z.infer<typeof songSchema>
export type SongArraySchema = z.infer<typeof songArraySchema> 
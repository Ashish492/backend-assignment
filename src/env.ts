import { z } from 'zod'

const envVariable = z.object({
  PUBLIC_KEY: z.string(),
  PRIVATE_KEY: z.string(),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL: z.string(),
  SALT_WORK_FACTOR: z.string(),
  PORT: z.string(),
  DATABASE_URL: z.string(),
})
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    /* eslint-disable @typescript-eslint/no-empty-interface */
    interface ProcessEnv extends z.infer<typeof envVariable> {}
  }
}

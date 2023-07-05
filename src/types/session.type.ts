import { isValidObjectId } from 'mongoose'
import { TypeOf, z } from 'zod'
const sessionSchema = z.object({
  userAgent: z.string(),
  user: z.string().refine((user) => isValidObjectId(user)),
})
const sessionRequestBodySchema = z.object({
  email: z.string({ required_error: 'email is required' }),
  password: z.string({ required_error: 'password is required' }),
})
export type sessionRequestBody = TypeOf<typeof sessionRequestBodySchema>
export const sessionRequestSchema = z.object({ body: sessionRequestBodySchema })
export type Session = TypeOf<typeof sessionSchema>
export type JWTPayload = {
  _id: string
  session: string
  name: string
}

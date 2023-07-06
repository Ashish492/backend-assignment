import { z } from 'zod'
import isUUID from 'validator/lib/isUUID'

export const userSchema = z
  .object({
    id: z.string({ required_error: 'enter valid id' }).refine((id) => isUUID(id), { message: 'enter valid id' }),
    name: z.string({ required_error: 'name is required' }).trim().nonempty('name is required'),
    email: z.string({ required_error: 'email is required' }).trim().nonempty().email('enter a valid email'),
    password: z.string({ required_error: 'password is required' }).refine((password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      return passwordRegex.test(password)
    }, 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and be a minimum of 8 characters long'),
    rePassword: z.string({ required_error: 'password is required' }),
  })
  .strict()
export const UserDtoSchema = userSchema
  .omit({
    id: true,
  })
  .refine((check) => check.rePassword === check.password, {
    message: 'password does not match',
    path: ['rePassword'],
  })
export type User = z.infer<typeof userSchema>
export type UserDto = z.infer<typeof UserDtoSchema>

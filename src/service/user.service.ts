import {} from 'zod'
import createHttpError from 'http-errors'
import { omit } from 'lodash'
import { db, logger, runService } from 'utils'
import { User, UserDto } from 'dto'
import { Prisma } from '@prisma/client'
import { compare, hash } from 'bcrypt'

export const insertUser = async (userData: Omit<UserDto, 'rePassword'>) => {
  try {
    const data = userData
    data.password = await hash(userData.password, process.env.SALT_WORK_FACTOR)
    const result = await db.user.create({ data })
    return result
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      logger.error('Duplicate data error:', error?.meta?.target)
      throw new Error('Duplicate data error: User or email already exists.')
    }
    throw createHttpError(500, (error as Error)?.message ?? 'unable to  create user', {
      cause: {
        error,
      },
    })
  }
}
export const findUserByEmail = async (email: string) => {
  return runService(async () =>
    db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        status: false,
      },
    })
  )
}
export const validatePassword = async ({ email, password }: Pick<User, 'password' | 'email'>) => {
  const user = await db.user.findFirst({
    where: { email, status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      status: false,
    },
  })
  if (!user) return false
  const validate = await compare(password, user.password)
  if (!validate) return false
  return omit(user, 'password')
}
export const removeUserByID = (id: string) => {
  runService(
    async () =>
      db.user.update({
        data: {
          status: 'DISABLED',
        },
        where: {
          id,
        },
      }),
    'unable to delete user'
  )
}

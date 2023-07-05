import jwt from 'jsonwebtoken'
import { JWTPayload } from 'types'
export const signJWT = async (object: object, options?: jwt.SignOptions) => {
  return jwt.sign(object, process.env.PRIVATE_KEY, {
    ...options,
    algorithm: 'RS256',
  })
}
export const verifyJwt = async (token: string) => {
  try {
    const decoded = (await jwt.verify(token, process.env.PUBLIC_KEY, { algorithms: ['RS256'] })) as JWTPayload
    return { decoded, expired: false, valid: true }
  } catch (error: unknown) {
    return {
      valid: false,
      expired: (<Error>error).message === 'jwt expired',
      decoded: null,
    }
  }
}

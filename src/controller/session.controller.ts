import createHttpError from 'http-errors'
import { createSession, findSession, invalidSession, validatePassword } from '../service'
import { CustomRouteFunction, JWTPayload, sessionRequestBody } from '../types'
import { signJWT, verifyJwt } from '../utils'
import config from 'config'
export const createSessionHandler: CustomRouteFunction<sessionRequestBody> = async (req, res) => {
  // validate  the user's password
  const user = await validatePassword(req.body)
  if (!user) throw createHttpError(401, 'invalid email or password')
  const session = await createSession({
    user: user._id.toString(),
    userAgent: req.get('user-agent') ?? '',
  })
  if (!session) return
  const accessToken = await signJWT(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get('accessTokenTtl') }
  )
  const refreshToken = await signJWT(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get('refreshTokenTtl') }
  )
  res.cookie('refreshToken', refreshToken, { signed: true, httpOnly: true })
  res.send({ refreshToken, accessToken })
}
export const getSessionHandler: CustomRouteFunction = async (req, res) => {
  const { _id: user } = req.user as JWTPayload
  const sessions = await findSession({ user, valid: true })
  res.send(sessions)
}
export const deleteSessionHandler: CustomRouteFunction = async (req, res) => {
  const { session: sessionId } = req.user as JWTPayload
  await invalidSession(sessionId)
  res.clearCookie('refreshToken')
  res.json({ msg: 'session deleted' })
}
export const issueToken: CustomRouteFunction = async (req, res) => {
  const { refreshToken } = req.body ?? req.signedCookies('refreshToken')
  if (!refreshToken) new createHttpError[401]()
  const { decoded, valid } = await verifyJwt(refreshToken)
  if (valid && decoded) {
    const session = await findSession({ _id: decoded.session, valid: true })
    if (session && session[0]) {
      const accessToken = signJWT(decoded, {
        algorithm: 'RS256',
        expiresIn: config.get('accessTokenTtl'),
      })
      return res.json(accessToken)
    }
  }
  throw new createHttpError[401]()
}

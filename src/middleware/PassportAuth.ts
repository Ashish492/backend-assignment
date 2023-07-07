import createHttpError from 'http-errors'
import passport from 'passport'
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt'

import { JWTPayload } from '../types'
import { findUserByEmail } from 'service'
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PUBLIC_KEY,
  algorithms: ['RS256'],
}
passport.use(
  new Strategy(options, async (payload: JWTPayload, done) => {
    try {
      const user = await findUserByEmail(payload.email)
      if (user) {
        return done(null, payload)
      }
      throw new Error()
    } catch (error) {
      return done(new createHttpError[401]('unauthorize'), false)
    }
  })
)
export function initializePassport() {
  return passport.initialize()
}
export function auth() {
  return passport.authenticate('jwt', { session: false })
}
export default passport

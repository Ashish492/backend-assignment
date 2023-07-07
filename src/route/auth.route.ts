import { getPayload, issueToken, logOut, loginHandler, validateToken } from 'controller'
import { userSchema } from 'dto'
import { Router } from 'express'
import { bodyValidator } from 'middleware'
import { customRouteFunction } from 'utils'

const authRouter = Router()
authRouter.route('/login').post(
  bodyValidator(
    userSchema.pick({
      email: true,
      password: true,
    })
  ),
  customRouteFunction(loginHandler)
)
authRouter.route('/refresh').post(customRouteFunction(issueToken))
authRouter.route('/validate').post(customRouteFunction(validateToken))
authRouter.route('/payload').get(customRouteFunction(getPayload))
authRouter.route('/logOut').post(customRouteFunction(logOut))
export default authRouter

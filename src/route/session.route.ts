import { Router } from 'express'
import { auth, validate } from '../middleware'
import { sessionRequestSchema } from '../types'
import { customRouteFunction } from '../utils'
import { createSessionHandler, deleteSessionHandler, getSessionHandler, issueToken } from '../controller'
export const sessionRouter = Router()
sessionRouter
  .route('/')
  .post(validate(sessionRequestSchema), customRouteFunction(createSessionHandler))
  .get(auth(), customRouteFunction(getSessionHandler))
sessionRouter.route('/delete').patch(auth(), customRouteFunction(deleteSessionHandler))
sessionRouter.route('/token').get(customRouteFunction(issueToken))

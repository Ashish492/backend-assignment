import { createUserHandler, deleteUser, getUserByEmailHandler } from 'controller'
import { UserDtoSchema, userSchema } from 'dto'
import { Router } from 'express'
import { auth, bodyValidator, getValidateObject, validate } from 'middleware'
import { customRouteFunction } from 'utils'

const userRouter = Router()
userRouter.route('/').post(bodyValidator(UserDtoSchema), customRouteFunction(createUserHandler))
userRouter.delete(
  '/:id',
  auth(),
  validate(getValidateObject(userSchema.pick({ id: true }))),
  customRouteFunction(deleteUser)
)
userRouter
  .route('/:email')
  .get(validate(getValidateObject(userSchema.pick({ email: true }))), customRouteFunction(getUserByEmailHandler))
export default userRouter

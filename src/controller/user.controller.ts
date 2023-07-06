import { omit } from 'lodash'
import { CustomRouteFunction } from 'types/customExpress.types'
import { User, UserDto } from 'dto'
import { findUserByEmail, insertUser, removeUserByID } from 'service'
export const createUserHandler: CustomRouteFunction<UserDto> = async (req, res) => {
  const data = omit(req.body, 'rePassword')
  const user = await insertUser(data)
  res.json(user)
}
export const getUserByEmailHandler: CustomRouteFunction<unknown, Pick<UserDto, 'email'>> = async (req, res) => {
  const user = await findUserByEmail(req.params.email)
  res.json(user)
}
export const deleteUser: CustomRouteFunction<unknown, Pick<User, 'id'>> = async (req, res) => {
  const user = await removeUserByID(req.params.id)
  res.json(user)
}

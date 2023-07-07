import {
  addProductHandler,
  deleteUser,
  findProductByIdHandler,
  getProductsHandler,
  updateProductByIdHandler,
} from 'controller'
import { ProductDtoSchema, ProductSchema, userSchema } from 'dto'
import { Router } from 'express'
import { bodyValidator, getValidateObject, validate } from 'middleware'
import {} from 'service'
import { customRouteFunction } from 'utils'
const productRouter = Router()
productRouter
  .route('/')
  .post(bodyValidator(ProductDtoSchema), customRouteFunction(addProductHandler))
  .get(getProductsHandler)
productRouter
  .route('/:id')
  .delete(validate(getValidateObject(userSchema.pick({ id: true }))), customRouteFunction(deleteUser))
  .get(validate(getValidateObject(userSchema.pick({ id: true }))), customRouteFunction(findProductByIdHandler))
  .patch(
    validate(getValidateObject(ProductSchema.pick({ id: true }), ProductDtoSchema.partial().strict())),
    updateProductByIdHandler
  )
export default productRouter

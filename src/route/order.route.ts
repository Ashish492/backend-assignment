import { createOrderHandler, deleteOrderHandler, getOrdersHandler } from 'controller'
import { OrderDtoSchema, OrderSchema } from 'dto'
import { Router } from 'express'
import { auth, bodyValidator, getValidateObject, validate } from 'middleware'
import { customRouteFunction } from 'utils'
const orderRouter = Router()
orderRouter
  .route('/')
  .post(auth(), bodyValidator(OrderDtoSchema), customRouteFunction(createOrderHandler))
  .get(customRouteFunction(getOrdersHandler))
orderRouter
  .route('/:id')
  .delete(auth(), validate(getValidateObject(OrderSchema.pick({ id: true }))), customRouteFunction(deleteOrderHandler))
  .patch(
    auth(),
    validate(getValidateObject(OrderSchema.pick({ id: true }), OrderDtoSchema)),
    customRouteFunction(deleteOrderHandler)
  )
export default orderRouter

import { subDays, subMonths, subWeeks, subYears } from 'date-fns'
import { Order, OrderDto } from 'dto'
import createHttpError from 'http-errors'
import { deleteOrder, getOrders, insertOrder, updateOrderById } from 'service'
import { CustomRouteFunction, JWTPayload, TimeDuration } from 'types'
export const createOrderHandler: CustomRouteFunction<OrderDto> = async (req, res) => {
  const order = insertOrder({ ...req.body, userId: (req.user as JWTPayload).id })
  res.json(order)
}
export const updateOrderHandler: CustomRouteFunction<OrderDto, Pick<Order, 'id'>> = async (req, res) => {
  const order = updateOrderById(req.body, req.params.id)
  res.json(order)
}
export const deleteOrderHandler: CustomRouteFunction<unknown, Pick<Order, 'id'>> = (req, res) => {
  const order = deleteOrder(req.params.id)
  res.json(order)
}
export const getOrdersHandler: CustomRouteFunction<unknown, Record<string, never>, Record<string, string>> = async (
  req,
  res
) => {
  const { _interval, _startDate, _endDate, ...restOperator } = req.query
  const whereCondition = restOperator ?? {}
  let report
  switch ((_interval as string).toLowerCase() as TimeDuration) {
    case 'today':
      report = await getOrders(subDays(new Date(), 0), new Date(), whereCondition)
      break
    case 'this week':
      report = await getOrders(subWeeks(new Date(), 1), new Date(), whereCondition)
      break
    case 'this month':
      report = await getOrders(subMonths(new Date(), 1), new Date(), whereCondition)
      break
    case 'this year':
      report = await getOrders(subYears(new Date(), 1), new Date(), whereCondition)
      break
    case 'custom':
      // eslint-disable-next-line no-case-declarations
      const partialStartDate = _startDate ? new Date(_startDate as string) : null
      // eslint-disable-next-line no-case-declarations
      const partialEndDate = _endDate ? new Date(_endDate as string) : new Date()
      report = await getOrders(partialStartDate, partialEndDate, whereCondition)
      break
    default:
      throw createHttpError.BadRequest('invalid data')
  }
  res.json(report)
}

import { format } from 'date-fns'
import { Order, OrderDto } from 'dto'
import { DateInterval } from 'types'
import { db, runService } from 'utils'
export const insertOrder = async (data: OrderDto) => {
  return runService(async () => db.order.create({ data }), 'unable to add order')
}
export const updateOrderById = (data: OrderDto, id: Order['id']) => {
  return runService(
    async () =>
      db.order.update({
        data,
        where: {
          id,
        },
      }),
    'unable to update order'
  )
}
export const deleteOrder = async (id: Order['id']) => {
  return runService(
    async () =>
      db.order.deleteMany({
        where: {
          id,
        },
      }),
    'unable to delete order'
  )
}
export const getOrderById = async (id: Order['id']) => {
  return runService(async () =>
    db.order.findUnique({
      where: {
        id,
      },
      include: {
        product: {
          select: {
            name: true,
            id: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
            id: true,
          },
        },
      },
    })
  )
}
export const getOrders = async (startDate: Date | null, endDate: Date | null, whereCondition: object = {}) => {
  const dateCondition: Record<string, string> = {}
  if (startDate) {
    dateCondition.gte = format(startDate, 'yyyy-MM-dd')
  }
  if (endDate) {
    dateCondition.lte = format(endDate, 'yyyy-MM-dd')
  }
  return runService(() =>
    db.order.findMany({
      where: {
        createdAt: dateCondition,
        ...whereCondition,
      },
      include: {
        product: {
          select: {
            name: true,
            id: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
            id: true,
          },
        },
      },
    })
  )
}
export const getTotalSale = async (interval: DateInterval, startDate: Date | null, endDate: Date | null) => {
  let whereCondition = startDate || endDate ? ' where ' : ''
  if (startDate) {
    whereCondition += `createdAt >= ${format(startDate, 'yyyy-MM-dd')} `
  }
  if (endDate) {
    whereCondition += startDate ? ' and ' : ''
    whereCondition += `createdAt >= ${format(endDate, 'yyyy-MM-dd')} `
  }
  const reportQuery = await db.$queryRaw`
  SELECT
    DATE_FORMAT(createdAt, ${
      // eslint-disable-next-line no-nested-ternary
      interval === 'WEEK' ? "'%x-%v'" : interval === 'DAY' ? "'%Y-%m-%d'" : interval === 'MONTH' ? "'%Y-%m'" : 'CUSTOM'
    }) as interval_start,
    SUM(totalAmount) as totalAmount
  FROM Order
 ${whereCondition} ${interval !== 'CUSTOM' ? 'GROUP BY interval_start' : ''}
`
  return reportQuery
}
export const highestSaleProduct = async (startDate: Date | null, endDate: Date | null) => {
  const whereCondition: Record<string, string> = {}
  if (startDate) {
    whereCondition.gte = format(startDate, 'yyyy-MM-dd')
  }
  if (endDate) {
    whereCondition.lte = format(endDate, 'yyyy-MM-dd')
  }
  return runService(async () =>
    db.order.groupBy({
      where: whereCondition,
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: [{ _sum: { quantity: 'desc' } }],
    })
  )
}

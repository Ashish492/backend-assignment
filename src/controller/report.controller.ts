import { subDays, subMonths, subWeeks, subYears } from 'date-fns'
import createHttpError from 'http-errors'
import { highestSaleProduct, getTotalSale } from 'service'
import { CustomRouteFunction, DateInterval, TimeDuration } from 'types'

export const getTotalSalesHandler: CustomRouteFunction<unknown, Record<string, never>, Record<string, string>> = async (
  req,
  res
) => {
  const { _interval, _startDate, _endDate } = req.query
  const startDate = _startDate ? new Date(_startDate) : null
  const endDate = _endDate ? new Date(_endDate) : null
  const report = await getTotalSale(_interval as DateInterval, startDate, endDate)
  res.json({
    interval: _interval,
    report,
  })
}
export const highestSaleProductHandler: CustomRouteFunction<
  unknown,
  Record<string, never>,
  Record<string, string>
> = async (req, res) => {
  const { _interval, _startDate, _endDate } = req.query

  let report
  switch ((_interval as string).toLowerCase() as TimeDuration) {
    case 'today':
      report = await highestSaleProduct(subDays(new Date(), 0), new Date())
      break
    case 'this week':
      report = await highestSaleProduct(subWeeks(new Date(), 1), new Date())
      break
    case 'this month':
      report = await highestSaleProduct(subMonths(new Date(), 1), new Date())
      break
    case 'this year':
      report = await highestSaleProduct(subYears(new Date(), 1), new Date())
      break
    case 'custom':
      // eslint-disable-next-line no-case-declarations
      const partialStartDate = _startDate ? new Date(_startDate as string) : null
      // eslint-disable-next-line no-case-declarations
      const partialEndDate = _endDate ? new Date(_endDate as string) : new Date()
      report = await highestSaleProduct(partialStartDate, partialEndDate)
      break
    default:
      throw createHttpError.BadRequest('invalid data')
  }
  res.json(report)
}

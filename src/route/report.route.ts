import { getTotalSalesHandler, highestSaleProductHandler } from 'controller'
import { Router } from 'express'
import { customRouteFunction } from 'utils'
const reportRouter = Router()
reportRouter.route('/totalSales').get(customRouteFunction(getTotalSalesHandler))
reportRouter.route('highestSale').get(customRouteFunction(highestSaleProductHandler))
export default reportRouter

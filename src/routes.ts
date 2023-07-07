import { Application, NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { order, product, report, user } from 'route'

export default function routes(app: Application) {
  app.use('/users', user)
  app.use('/reports', report)
  app.use('/product', product)
  app.use('/order', order)
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new createHttpError.NotFound())
  })
}

import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { CustomRouteFunction, MyRequest } from '../types'
import * as core from 'express-serve-static-core'
import * as qs from 'qs'
type basicFun<P extends core.ParamsDictionary = {}, Q extends qs.ParsedQs = {}> = (
  req: Request<P, any, any, Q>,
  res: Response<any>,
  next: NextFunction
) => any
export function customRouteFunction<B, P extends core.ParamsDictionary, Q extends qs.ParsedQs>(
  fn: CustomRouteFunction<B, P, Q>
): basicFun<P, Q> {
  return (req, res, next) => {
    fn(req as MyRequest<B, P, Q>, res, next).catch(next)
  }
}
export const runService = async <T>(fn: (...args: any[]) => T, msg?: string): Promise<T | void> => {
  try {
    return await fn()
  } catch (error) {
    throw createHttpError(500, msg ?? 'internal server Error', { cause: error })
  }
}

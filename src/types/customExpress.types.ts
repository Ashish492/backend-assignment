import { NextFunction, Request, Response } from "express"
import * as core from 'express-serve-static-core'
export interface MyRequest<B = unknown, P extends core.ParamsDictionary = {}, Q extends qs.ParsedQs = {}> extends Request {
  body: B;
  params: P;
  query: Q;

}
export type CustomRouteFunction<B = unknown, P extends core.ParamsDictionary = {}, Q extends qs.ParsedQs = {}> = (
  req: MyRequest<B, P, Q>,
  res: Response,
  next: NextFunction
) => any

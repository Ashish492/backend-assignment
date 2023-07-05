import express, { Application, ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { ZodError } from 'zod'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import createHttpError from 'http-errors'
import routes from './routes'
import { initializePassport } from './middleware'
import {} from './utils'
import 'dotenv'
const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(initializePassport())
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400)
    res.json(err.issues)
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token')
  }
  if (err instanceof createHttpError.HttpError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    })
  }
  res.status(err?.statusCode ?? err?.code ?? 500)
  res.json({
    success: false,
    message: err.message ?? 'failed',
  })
}
routes(app)
app.use(errorHandler)
export default app

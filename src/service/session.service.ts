import { FilterQuery, UpdateQuery } from 'mongoose'
import { SessionModel, SessionType } from '../model'
import { Session } from '../types'
import { runService } from '../utils/helper'
export const createSession = (session: Session) => {
  return runService(async () => (await SessionModel.create(session)).toObject(), 'unable to create session')
}
export const findSession = (query: FilterQuery<SessionType>) => {
  return SessionModel.find(query).lean()
}
export const updateSession = async (query: FilterQuery<SessionType>, update: UpdateQuery<SessionType>) => {
  return runService(async () => await SessionModel.updateMany(query, update))
}
export const invalidSession = async (sessionId: string) => {
  return runService(async () => await SessionModel.findByIdAndUpdate(sessionId, { valid: false }))
}

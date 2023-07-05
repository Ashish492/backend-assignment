import { ZodError } from "zod";
import { UserModel } from "../model";
import { User } from "../types";
import { ObjectId } from "mongoose";
import { runService } from "../utils/helper";
import createHttpError from "http-errors";
import { pick } from "lodash";
export const insertUser = async (user: User) => {
    try {
        const result = await UserModel.create(user)
        return result
    } catch (error: any) {
        if (error.code === 11000) {
            throw new ZodError([{
                code: "custom",
                path: [
                    "body", "email"
                ],
                message: "email already taken"
            }])
        }
        throw createHttpError(500, error?.message ?? "unable to  create user", {
            cause: {
                error
            }
        })
    }
}
export const getUsers = async () => {
    return runService(async () => await UserModel.find({}).hideVersion())
}
export const removeUser = async (id: ObjectId) => {
    return runService(async () => await UserModel.findByIdAndDelete(id))
}
export const validatePassword = async ({ email, password }: Omit<User, "name">) => {
    const user = await UserModel.findOne({ email }).select("+password")
    if (!user)
        return false
    const validate = await user.comparePassword(password)
    if (!validate)
        return;

    return pick(user.toObject(), ["email", "name", "_id"]);
}

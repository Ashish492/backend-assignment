import { Router } from "express";
import { customRouteFunction } from "../utils";
import { createUser, deleteUser, getUser } from "../controller";
import { validate } from "../middleware";
import { userRequestIdSchema, userRequestSchema } from "../types";

export const userRouter=Router()
userRouter.route("/").post(validate(userRequestSchema) ,customRouteFunction(createUser)).get(customRouteFunction(getUser))
userRouter.delete("/:id",validate(userRequestIdSchema), customRouteFunction(deleteUser))
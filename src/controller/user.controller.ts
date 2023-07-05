import { omit } from "lodash";
import { getUsers, insertUser, removeUser } from "../service";
import { CustomRouteFunction } from "../types/customExpress.types";
import { User } from "../types/user.types";
import { ObjectId } from "mongoose";

export const createUser: CustomRouteFunction<User> = async (req, res) => {

    // auth with passport js?
    const user = await insertUser(omit(req.body, "rePassword"))
    res.json(omit(user.toJSON(), ["password", "__v"]))
}
export const getUser: CustomRouteFunction = async (_, res) => {
    const user = await getUsers()
    if (user) res.json(user)
}

export const deleteUser: CustomRouteFunction = async (req, res) => {
    const { id } = req.params as {
        id: ObjectId
    }
    const user = await removeUser(id)
    res.json(user)

}

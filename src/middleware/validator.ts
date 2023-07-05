import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError} from "zod";
export const validate=(schema:AnyZodObject)=>async (req:Request,res:Response,next:NextFunction)=>{
try {
 await schema.parseAsync({
    body:req.body,
    query:req.query,
    params:req.params
})
next()
} catch (e:any) {
if(e instanceof ZodError){

return res.status(500).json(e.errors)
}
}
}
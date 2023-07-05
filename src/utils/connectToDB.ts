import mongoose from "mongoose";
import config from "config";
mongoose.set('runValidators', true);
export default function connectToDB(){
    return mongoose.connect(config.get("dbUri"))
}
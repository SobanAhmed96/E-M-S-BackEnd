import mongoose from "mongoose";
import { dbName } from "../constant.js";

const connectDB = async () => {
    try {
       const host = await mongoose.connect(`${process.env.DB_URI}${dbName}`);
       console.log(`DB Connect Successfully !! DB Host: ${host.connection.host}`);
    } catch (error) {
        console.log(`DB CONNECTION ERROR ${error}`);
    }
}

export default connectDB;
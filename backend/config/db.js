import mongoose from "mongoose";
import "dotenv/config"
mongoose.set("strictQuery",false);
export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected",conn.connection.host)
    }catch(err){
        console.log(err)
    }
}
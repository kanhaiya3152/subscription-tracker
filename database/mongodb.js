import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error("Please define mongodb-uri")
}

const connectToDatabase = async() =>{
    try {
        await mongoose.connect(DB_URI)

        console.log(`connected to database in ${NODE_ENV} mode`);
        
    } catch (error) {
        console.error('Error connecting to database: ',error)
        process.exit()
    }
}

export default connectToDatabase

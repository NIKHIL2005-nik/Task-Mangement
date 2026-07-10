import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionResponse = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`mongoDB connect successfully ${connectionResponse}`);
    } catch (error) {
        console.log('mongoDB connection failed !!\nError :', error)
        process.exit(1)
    }
}

export {connectDB}
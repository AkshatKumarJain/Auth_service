import mongoose from "mongoose"

export const connectDB = async ()=> {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}${process.env.DB_NAME}`);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error: ",error);
    }
}

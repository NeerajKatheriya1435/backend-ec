import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database connected successfully`)
    } catch (error) {
        console.log("Error while connecting with database", error)
    }
}
export default connectDB
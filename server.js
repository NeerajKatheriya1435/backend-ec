import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authRoute from "./route/authRoute.js"
import categoryRoute from "./route/categoryRoute.js"
import productRoute from "./route/productRoute.js"
import cors from "cors"

//dotenv configuration
dotenv.config()

//database configuration
connectDB()

//express app
const app = express();
const PORT = process.env.PORT


//middleware
app.use(express.json());
app.use(cors())


//routes
app.use("/api/v1/user", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

//app listening port
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`)
})

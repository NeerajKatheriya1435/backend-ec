import mongoose from "mongoose";
const orderSchema = mongoose.Schema({
    product: [
        {
            type: mongoose.ObjectId,
            ref: "product"
        }
    ],
    buyer: {
        type: mongoose.ObjectId,
        ref: "users"
    },
    payment: {},
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]
    }
}, { timestamps: true })

const orderModel = mongoose.model("orders", orderSchema)

export default orderModel
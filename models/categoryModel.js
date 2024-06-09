import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    slug: {
        type: String,
        require: true
    }
})
const catModel = mongoose.model("category", categorySchema)
export default catModel
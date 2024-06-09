import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";


export const requireSignIn = (req, res, next) => {
    try {
        const decode = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        req.user = decode;
        next()
    } catch (error) {
        return res.status(400).send({
            success: false,
            message: "Invalid token",
            error
        })
    }
}
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role !== 1) {
            return res.status(400).send({
                success: false,
                message: "Unauthorize access",
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            error,
            success: false,
            message: "Error in admin middleware",
        })
    }

}


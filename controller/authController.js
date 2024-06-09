import Jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        if (!name || !email || !password || !phone || !address || !answer) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            })
        }

        //check existing user
        const existingUSer = await userModel.findOne({ email });
        if (existingUSer) {
            return res.status(400).send({
                success: false,
                message: "User is already exist please login"
            })
        }
        // hash password and save user detail
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({
            name, email, phone, address, password: hashedPassword, answer
        }).save()
        return res.status(201).send({
            success: true,
            message: "User registred successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while register data",
            error
        })
    }

}

//login controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Email does not exists"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        const token = Jwt.sign({ _id: user.id }, process.env.SECRET_KEY, { expiresIn: "8d" })
        return res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while login",
            error
        })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, newPassword, answer } = req.body;
        if (!email || !newPassword || !answer) {
            return res.status(500).send({
                success: false,
                message: "All fields are required",
            })
        }
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "Wrong Email or Password",
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed }, { new: true })
        return res.status(200).send({
            success: true,
            message: "Password change successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while reset password",
            error
        })
    }

}

//update user profile

export const updateUserDetails = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const updateUser = await userModel.findOneAndUpdate({ email }, { name, email, phone, address }, { new: true })
        return res.status(200).send({
            success: true,
            message: "Updated user information",
            updateUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while updating user profile",
            error
        })
    }
}

//test
export const testController = (req, res) => {
    return res.status(200).send({
        success: true,
        message: "test user"
    })
}

//orders of user
export const getOrderDetail = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("product", "-photo").populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error
        })
    }
}
//details check for admin
export const getAllOrderDetail = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("product", "-photo").populate("buyer", "name").sort({ createdAt: -1 })
        res.json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting all orders",
            error
        })
    }
}

//order status
export const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while getting status",
            error
        })
    }
}
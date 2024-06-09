import express from "express"
import {
    forgotPasswordController,
    getAllOrderDetail,
    getOrderDetail,
    loginController,
    orderStatus,
    registerController,
    testController,
    updateUserDetails
} from "../controller/authController.js"
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

//register user
router.post("/register", registerController)
router.post("/login", loginController)
router.post("/test", requireSignIn, isAdmin, testController)

//protected user routes
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})
//protected admin routes
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

router.post("/forgot-password", forgotPasswordController)
router.put("/update-profile", requireSignIn, updateUserDetails)

router.get("/user-orders", requireSignIn, getOrderDetail)
router.get("/admin-orders-details", requireSignIn, isAdmin, getAllOrderDetail)
router.put("/orders-stauts/:orderId", requireSignIn, isAdmin, orderStatus)


export default router
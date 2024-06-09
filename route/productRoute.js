import express from "express";
import {
    braintreePayment,
    braintreeToken,
    categoryProduct,
    countProduct, createProductController, deleteProduct, getAllProduct,
    getProductPhoto, getSingleProduct, perPageProduct,
    productFilter, realtedProduct, searchProduct, updateProduct
} from "../controller/productController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import formidableMiddleware from 'express-formidable';

const router = express.Router()

router.post("/create-new-product", requireSignIn, isAdmin, formidableMiddleware(), createProductController)
router.get("/get-single-product/:slug", getSingleProduct)
router.put("/update-product/:pid", requireSignIn, isAdmin, formidableMiddleware(), updateProduct)
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProduct)
router.get("/get-all-product", getAllProduct)
router.get("/get-product-photo/:pid", getProductPhoto)


router.post("/get-filter-product", productFilter)
router.get("/get-count-product", countProduct)
router.get("/get-product-perpage/:page", perPageProduct)
router.get("/search-product/:keywords", searchProduct)
router.get("/realted-product/:pid/:cid", realtedProduct)
router.get("/category-product/:slug", categoryProduct)

//payment routes
router.get("/braintree/token", braintreeToken)
router.post("/braintree/payment", requireSignIn, braintreePayment)
export default router
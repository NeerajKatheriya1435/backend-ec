import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { createCategoryController, deleteCategory, fetchAllcategory, fetchSingleCategory, updateCategory } from "../controller/categoryController.js"
const router = express.Router()

//category
router.post("/create-new-category", requireSignIn, isAdmin, createCategoryController)
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategory)
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory)
router.get("/fetch-single-category/:slug", fetchSingleCategory)
router.get("/fetch-all-category", fetchAllcategory)

export default router
import slugify from "slugify";
import catModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Filed is required"
            })
        }
        const existingCategory = await catModel.findOne({ name })
        if (existingCategory) {
            return res.status(400).send({
                success: false,
                message: "Category already exists"
            })
        }
        const category = await new catModel({ name, slug: slugify(name) }).save()
        return res.status(201).send({
            success: true,
            message: "Category created successfully",
            category
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while creating category"
        })
    }
}

//update category
export const updateCategory = async (req, res) => {
    try {
        const { newName } = req.body;
        const { id } = req.params;
        if (!newName) {
            return res.status(400).send({
                success: false,
                message: "Fieled is required"
            })
        }
        await catModel.findByIdAndUpdate(id, { name: newName, slug: slugify(newName) }, { new: true })
        return res.status(200).send({
            success: true,
            message: "Updated category succeesfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while updating category"
        })
    }
}
//delete category
export const deleteCategory = async (req, res) => {
    try {
        // const {id}=req.params
        await catModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success: true,
            message: "Deleted category succeesfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error while deleting category"
        })
    }
}
//fetch single category
export const fetchSingleCategory = async (req, res) => {
    try {
        const singleCategory = await catModel.findOne({ slug: req.params.slug })
        return res.status(200).send({
            success: true,
            message: "Fetched single category succeesfully",
            singleCategory
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while fetching single category"
        })
    }
}

//all category
export const fetchAllcategory = async (req, res) => {
    try {
        const allCategory = await catModel.find({})
        return res.status(200).send({
            success: true,
            message: "Feched category successfully",
            allCategory
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error,
            success: false,
            message: "Error while fetching all category"
        })
    }
}